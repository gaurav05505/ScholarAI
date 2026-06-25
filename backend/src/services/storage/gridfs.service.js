import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

function getBucket() {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not ready');
  }

  return new GridFSBucket(mongoose.connection.db, {
    bucketName: 'pdfFiles',
  });
}

export async function savePdfToGridFs({ buffer, filename, contentType }) {
  const bucket = getBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.end(buffer);
  });
}

export async function downloadPdfFromGridFs(fileId) {
  if (!fileId) {
    throw new Error('fileId is required');
  }

  const bucket = getBucket();
  const objectId = new mongoose.Types.ObjectId(fileId);

  return new Promise((resolve, reject) => {
    const chunks = [];
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('data', (chunk) => chunks.push(chunk));
    downloadStream.on('error', reject);
    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function deletePdfFromGridFs(fileId) {
  if (!fileId) {
    return;
  }

  const bucket = getBucket();
  await bucket.delete(new mongoose.Types.ObjectId(fileId));
}
