import DocModel from '../models/doc.model.js';
import { downloadPdfFromGridFs } from '../services/storage/gridfs.service.js';
import { extractTextFromPdf, extractTextFromUrl, processDocumentContent } from '../services/vector.service.js';

const pendingJobs = [];
let isProcessing = false;
let workerStarted = false;

async function processDocument(docId) {
  const doc = await DocModel.findById(docId);

  if (!doc) {
    return;
  }

  if (doc.status === 'completed') {
    return;
  }

  doc.status = 'processing';
  doc.errorMessage = null;
  await doc.save();

  let text = '';

  if (doc.sourceType === 'pdf') {
    if (!doc.storageFileId) {
      throw new Error('Missing stored PDF file reference');
    }

    const pdfBuffer = await downloadPdfFromGridFs(doc.storageFileId);
    text = await extractTextFromPdf(pdfBuffer);
  } else if (doc.sourceType === 'url') {
    if (!doc.sourceUrl) {
      throw new Error('Missing source URL');
    }

    text = await extractTextFromUrl(doc.sourceUrl);
  } else {
    throw new Error(`Unsupported source type: ${doc.sourceType}`);
  }

  const processed = await processDocumentContent({
    docId: doc._id,
    userId: doc.user,
    title: doc.title,
    sourceType: doc.sourceType,
    sourceUrl: doc.sourceUrl,
    text,
  });

  doc.chunkCount = processed.chunkCount;
  doc.vectorCount = processed.vectorCount;
  doc.status = 'completed';
  doc.metadata = {
    ...(doc.metadata?.toObject ? doc.metadata.toObject() : doc.metadata || {}),
    processedAt: new Date().toISOString(),
  };
  await doc.save();
}

async function runQueue() {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  while (pendingJobs.length) {
    const job = pendingJobs.shift();

    try {
      await processDocument(job.docId);
    } catch (error) {
      console.error(`Document job failed for ${job.docId}:`, error);

      try {
        await DocModel.findByIdAndUpdate(job.docId, {
          status: 'failed',
          errorMessage: error.message,
        });
      } catch (updateError) {
        console.error(`Failed to mark document ${job.docId} as failed:`, updateError);
      }
    }
  }

  isProcessing = false;
}

export function enqueueDocumentProcessing(docId) {
  pendingJobs.push({ docId: String(docId) });
  setImmediate(() => {
    void runQueue();
  });
}

export function startDocumentWorker() {
  if (workerStarted) {
    return;
  }

  workerStarted = true;
}

export async function recoverQueuedDocuments() {
  const queuedDocs = await DocModel.find({
    status: 'queued',
  }).sort({ createdAt: 1 });

  for (const doc of queuedDocs) {
    enqueueDocumentProcessing(doc._id);
  }
}
