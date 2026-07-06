import DocModel from '../models/doc.model.js';
import ChatModel from '../models/chat.model.js';
import { chatWithLLM } from '../services/llm.service.js';
import {
  savePdfToGridFs,
  deletePdfFromGridFs,
  enqueueDocumentProcessing,
  getEmbeddings,
  getPineconeIndex,
  deleteDocumentFromPinecone,
  getPdfBufferFromGridFs,
} from '../services/rag.service.js';

async function answerDocumentQuestion({ doc, question, userId }) {
  const queryVector = (await getEmbeddings([question], true))[0];
  const index = getPineconeIndex();

  let contextText = '';
  let sources = [];

  if (index) {
    const matches = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
      filter: {
        docId: doc._id.toString(),
      },
    });

    if (matches && matches.matches) {
      contextText = matches.matches.map((m) => m.metadata.text).join('\n\n');
      sources = matches.matches.map((m) => ({
        text: m.metadata.text,
        title: m.metadata.title || doc.title,
        docId: m.metadata.docId || doc._id.toString(),
        score: m.score,
      }));
    }
  }

  const prompt = `You are ScolarAI, a helpful AI assistant.
Answer the user's question contextually using only the provided document excerpts.

Key Guidelines:
1. Focus on summarizing the actual topics, facts, tables, and data present in the excerpts (e.g. database schemas, project roadmaps, architecture components).
2. Frame your answer as describing the contents of the uploaded document (e.g., "The document contains...", "According to the excerpts..."). Avoid speaking as if you are explaining the live application's own code or database structure.
3. Be clear, concise, and structured.

Document Title: ${doc.title}

Document Excerpts:
${contextText || 'No relevant excerpts found.'}

User Question: ${question}

Answer:`;

  const answer = await chatWithLLM(prompt);

  return {
    answer,
    provider: 'nvidia',
    model: 'meta/llama-3.1-70b-instruct',
    sources,
  };
}

async function uploadDoc(req, res) {
  try {
    const requestedSourceType = (req.body.sourceType || (req.file ? 'pdf' : 'url'))
      .toString()
      .toLowerCase();
    const sourceType = ['pdf', 'url'].includes(requestedSourceType)
      ? requestedSourceType
      : null;

    if (!sourceType) {
      return res.status(400).json({
        success: false,
        message: 'sourceType must be either pdf or url',
      });
    }

    const uploadedFile = req.file;
    const sourceUrl = (req.body.sourceUrl || req.body.url || '').trim();
    const providedTitle = req.body.title?.trim();

    let title = providedTitle;
    let storageFileId = null;
    let originalName = null;
    let fileSize = null;
    let mimeType = null;

    if (sourceType === 'pdf') {
      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF file',
        });
      }

      originalName = uploadedFile.originalname;
      fileSize = uploadedFile.size;
      mimeType = uploadedFile.mimetype;
      title = title || uploadedFile.originalname.replace(/\.pdf$/i, '');
      storageFileId = await savePdfToGridFs({
        buffer: uploadedFile.buffer,
        filename: uploadedFile.originalname,
        contentType: uploadedFile.mimetype,
      });
    }

    if (sourceType === 'url') {
      if (!sourceUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid sourceUrl',
        });
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(sourceUrl);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'sourceUrl must be a valid URL',
        });
      }

      title = title || parsedUrl.hostname.replace(/^www\./i, '');
    }

    const document = await DocModel.create({
      user: req.user._id,
      sourceType,
      title,
      originalName,
      sourceUrl: sourceType === 'url' ? sourceUrl : undefined,
      storageFileId,
      fileSize,
      mimeType,
      status: 'queued',
      metadata: {
        ingestionMode: sourceType,
        sourceUrl: sourceType === 'url' ? sourceUrl : null,
      },
    });

    enqueueDocumentProcessing(document._id);

    return res.status(202).json({
      success: true,
      message: 'Document queued for processing',
      data: document,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload document',
    });
  }
}

async function askDocQuestion(req, res) {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'question is required',
      });
    }

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (doc.status !== 'completed') {
      return res.status(409).json({
        success: false,
        message: 'Document is still processing. Please try again after upload finishes.',
      });
    }

    const result = await answerDocumentQuestion({
      doc,
      question: question.trim(),
      userId: req.user._id,
    });

    const chat = await ChatModel.create({
      user: req.user._id,
      doc: doc._id,
      question: question.trim(),
      answer: result.answer,
      provider: result.provider,
      model: result.model,
      sources: result.sources,
    });

    return res.status(200).json({
      success: true,
      message: 'Answer generated successfully',
      data: {
        chat,
        sources: result.sources,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to answer question',
    });
  }
}

async function deleteDoc(req, res) {
  try {
    const { id } = req.params;

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (doc.storageFileId) {
      try {
        await deletePdfFromGridFs(doc.storageFileId);
      } catch (error) {
        console.error('File deletion error:', error.message);
      }
    }

    try {
      await deleteDocumentFromPinecone(doc._id);
    } catch (error) {
      console.error('Pinecone vector deletion error:', error.message);
    }

    await ChatModel.deleteMany({
      doc: doc._id,
      user: req.user._id,
    });

    await DocModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete document',
    });
  }
}

async function listDocs(req, res) {
  try {
    const docs = await DocModel.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: docs.length,
      data: docs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch documents',
    });
  }
}

async function getDocById(req, res) {
  try {
    const { id } = req.params;

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch document',
    });
  }
}

async function updateDoc(req, res) {
  try {
    const { id } = req.params;
    const { title, status, sourceUrl, metadata, errorMessage, chunkCount, vectorCount } = req.body;

    const doc = await DocModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (title !== undefined) doc.title = title.trim();
    if (status !== undefined) doc.status = status;
    if (sourceUrl !== undefined) doc.sourceUrl = sourceUrl;
    if (metadata !== undefined) doc.metadata = metadata;
    if (errorMessage !== undefined) doc.errorMessage = errorMessage;
    if (chunkCount !== undefined) doc.chunkCount = chunkCount;
    if (vectorCount !== undefined) doc.vectorCount = vectorCount;

    await doc.save();

    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: doc,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update document',
    });
  }
}

async function viewDocFile(req, res) {
  try {
    const { id } = req.params;
    const doc = await DocModel.findById(id);

    if (!doc) {
      return res.status(404).send('Document not found');
    }

    if (doc.sourceType === 'url') {
      if (doc.sourceUrl) {
        return res.redirect(doc.sourceUrl);
      }
      return res.status(400).send('URL document has no source URL');
    }

    if (doc.sourceType === 'pdf') {
      if (!doc.storageFileId) {
        return res.status(404).send('PDF file storage ID not found');
      }

      const buffer = await getPdfBufferFromGridFs(doc.storageFileId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalName || doc.title + '.pdf')}"`);
      return res.send(buffer);
    }

    return res.status(400).send('Unsupported document source type');
  } catch (error) {
    console.error('Error viewing document file:', error);
    return res.status(500).send('Failed to retrieve document file');
  }
}

export default {
  uploadDoc,
  listDocs,
  getDocById,
  updateDoc,
  deleteDoc,
  askDocQuestion,
  viewDocFile,
};
