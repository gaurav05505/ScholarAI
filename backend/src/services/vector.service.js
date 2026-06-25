import fs from 'fs/promises';
import * as pdfParseModule from 'pdf-parse';
import { createEmbeddings } from './embeddings/index.js';

const parsePdf = pdfParseModule.default || pdfParseModule;

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function decodeBasicEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function chunkText(text, chunkSize = 1200, overlap = 200) {
  const normalizedText = normalizeWhitespace(text || '');
  if (!normalizedText) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < normalizedText.length) {
    const end = Math.min(start + chunkSize, normalizedText.length);
    const chunk = normalizedText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === normalizedText.length) {
      break;
    }

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

export async function extractTextFromPdf(pdfSource) {
  const fileBuffer = Buffer.isBuffer(pdfSource)
    ? pdfSource
    : await fs.readFile(pdfSource);
  const pdfData = await parsePdf(fileBuffer);
  return normalizeWhitespace(pdfData.text || '');
}

export async function extractTextFromUrl(sourceUrl) {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  return normalizeWhitespace(decodeBasicEntities(text));
}

async function upsertVectors({ vectors, namespace }) {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexHost = process.env.PINECONE_INDEX_HOST;

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY is missing');
  }

  if (!indexHost) {
    throw new Error('PINECONE_INDEX_HOST is missing');
  }

  const response = await fetch(`https://${indexHost}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespace,
      vectors,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Pinecone upsert failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

async function queryVectors({ namespace, queryEmbedding, topK, filter }) {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexHost = process.env.PINECONE_INDEX_HOST;

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY is missing');
  }

  if (!indexHost) {
    throw new Error('PINECONE_INDEX_HOST is missing');
  }

  const response = await fetch(`https://${indexHost}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      namespace,
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Pinecone query failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function processDocumentContent({ docId, userId, title, sourceType, sourceUrl, text }) {
  const chunks = chunkText(text);

  if (!chunks.length) {
    throw new Error('No text could be extracted from the document');
  }

  const embeddings = await createEmbeddings(chunks);
  const namespace = String(userId);
  const vectors = chunks.map((chunk, index) => ({
    id: `${docId}-${index + 1}`,
    values: embeddings[index],
    metadata: {
      docId: String(docId),
      userId: String(userId),
      title,
      sourceType,
      sourceUrl: sourceUrl || '',
      chunkIndex: index + 1,
      text: chunk,
    },
  }));

  for (let index = 0; index < vectors.length; index += 100) {
    const batch = vectors.slice(index, index + 100);
    await upsertVectors({ vectors: batch, namespace });
  }

  return {
    chunkCount: chunks.length,
    vectorCount: vectors.length,
    chunks,
  };
}

export async function queryRelevantChunks({ userId, docId, question, topK = 5 }) {
  const [questionEmbedding] = await createEmbeddings([question]);
  const response = await queryVectors({
    namespace: String(userId),
    queryEmbedding: questionEmbedding,
    topK,
    filter: {
      docId: {
        $eq: String(docId),
      },
    },
  });

  const matches = response.matches || [];

  return matches.map((match) => ({
    id: match.id,
    score: match.score,
    text: match.metadata?.text || '',
    chunkIndex: match.metadata?.chunkIndex || null,
    title: match.metadata?.title || '',
    sourceType: match.metadata?.sourceType || '',
    sourceUrl: match.metadata?.sourceUrl || '',
  }));
}
