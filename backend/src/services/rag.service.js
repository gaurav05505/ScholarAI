import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
import axios from 'axios'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse')

import { EventEmitter } from 'events'
import { Pinecone } from '@pinecone-database/pinecone'
import nvidia from '../config/nvidia.js'
import DocModel from '../models/doc.model.js'

const docEmitter = new EventEmitter()

// Initialize Pinecone index dynamically
let pineconeIndex = null
export const getPineconeIndex = () => {
  if (pineconeIndex) return pineconeIndex
  const apiKey = process.env.PINECONE_API_KEY
  const indexName = process.env.PINECONE_INDEX_NAME
  const indexHost = process.env.PINECONE_INDEX_HOST
  if (!apiKey || !indexName) {
    console.warn(
      'WARNING: PINECONE_API_KEY or PINECONE_INDEX_NAME is missing in environment. Pinecone operations will be skipped.'
    )
    return null
  }
  try {
    const pc = new Pinecone({ apiKey })
    // If PINECONE_INDEX_HOST is provided, pass it directly to avoid network checks
    pineconeIndex = pc.index(indexName, indexHost || undefined)
    return pineconeIndex
  } catch (err) {
    console.error('Failed to initialize Pinecone Client:', err.message)
    return null
  }
}

// GridFS Storage helper functions
export const savePdfToGridFs = ({ buffer, filename, contentType }) => {
  return new Promise((resolve, reject) => {
    try {
      const db = mongoose.connection.db
      const bucket = new GridFSBucket(db, { bucketName: 'pdfs' })
      const uploadStream = bucket.openUploadStream(filename, {
        contentType,
      })
      uploadStream.end(buffer)
      uploadStream.on('finish', () => resolve(uploadStream.id))
      uploadStream.on('error', (err) => reject(err))
    } catch (error) {
      reject(error)
    }
  })
}

export const getPdfBufferFromGridFs = (fileId) => {
  return new Promise((resolve, reject) => {
    try {
      const db = mongoose.connection.db
      const bucket = new GridFSBucket(db, { bucketName: 'pdfs' })
      const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
      const chunks = []
      downloadStream.on('data', (chunk) => chunks.push(chunk))
      downloadStream.on('error', (err) => reject(err))
      downloadStream.on('end', () => resolve(Buffer.concat(chunks)))
    } catch (error) {
      reject(error)
    }
  })
}

export const deletePdfFromGridFs = (fileId) => {
  try {
    const db = mongoose.connection.db
    const bucket = new GridFSBucket(db, { bucketName: 'pdfs' })
    return bucket.delete(new mongoose.Types.ObjectId(fileId))
  } catch (error) {
    console.error('GridFS PDF deletion error:', error.message)
    return Promise.resolve()
  }
}

// Text Extraction Helpers
export const extractTextFromPdf = async (buffer) => {
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  return result.text || ''
}

export const extractTextFromUrl = async (url) => {
  const response = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeout: 10000,
  })
  const html = response.data
  if (typeof html !== 'string') {
    throw new Error('Response data is not a string HTML')
  }

  // Strip scripts, styles, and HTML tags
  let text = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return text
}

// Text Chunking (1000 chars size, 200 chars overlap)
export const chunkText = (text, size = 1000, overlap = 200) => {
  if (!text) return []
  const chunks = []
  let i = 0
  while (i < text.length) {
    const chunk = text.slice(i, i + size).trim()
    if (chunk) {
      chunks.push(chunk)
    }
    i += size - overlap
  }
  return chunks
}

// Generate Embeddings using NVIDIA API
export const getEmbeddings = async (inputs, isQuery = false) => {
  try {
    const response = await nvidia.post('/embeddings', {
      input: inputs,
      model: 'nvidia/nv-embedqa-e5-v5',
      input_type: isQuery ? 'query' : 'passage',
      encoding_format: 'float',
    })
    
    if (response.data && response.data.data) {
      return response.data.data.map((item) => item.embedding)
    }
    throw new Error('Invalid embeddings response from NVIDIA API')
  } catch (error) {
    console.error('NVIDIA Embeddings generation error:', error.response?.data || error.message)
    throw new Error('Failed to generate vector embeddings.')
  }
}

// Pinecone Database Operations
export const upsertDocumentToPinecone = async (docId, userId, title, chunks, embeddings) => {
  const index = getPineconeIndex()
  if (!index) return

  const vectors = chunks.map((chunk, idx) => ({
    id: `${docId}_${idx}`,
    values: embeddings[idx],
    metadata: {
      docId: docId.toString(),
      userId: userId.toString(),
      text: chunk,
      title: title,
    },
  }))

  // Pinecone recommends upserting in small batches (e.g. 100 vectors max)
  for (let i = 0; i < vectors.length; i += 100) {
    const batch = vectors.slice(i, i + 100)
    await index.upsert({
      records: batch
    })
  }
}

export const deleteDocumentFromPinecone = async (docId) => {
  const index = getPineconeIndex()
  if (!index) return
  try {
    const doc = await DocModel.findById(docId)
    if (!doc) return

    const count = Math.max(doc.chunkCount || 0, doc.vectorCount || 0)
    if (count === 0) return

    const vectorIds = []
    for (let i = 0; i < count; i++) {
      vectorIds.push(`${docId}_${i}`)
    }

    if (vectorIds.length > 0) {
      console.log(`Deleting ${vectorIds.length} vectors from Pinecone for doc: ${docId}`)
      await index.deleteMany({ ids: vectorIds })
    }
  } catch (error) {
    console.error(`Pinecone vector deletion failed for doc ${docId}:`, error.message)
  }
}

export const searchPinecone = async (queryVector, userId, limit = 5) => {
  const index = getPineconeIndex()
  if (!index) return []
  try {
    const response = await index.query({
      vector: queryVector,
      topK: limit,
      includeMetadata: true,
      filter: {
        userId: userId.toString(),
      },
    })
    return response.matches || []
  } catch (error) {
    console.error('Pinecone search failed:', error.message)
    return []
  }
}

// Background Document Ingestion queue listener
docEmitter.on('process-doc', async (docId) => {
  let doc = null
  try {
    doc = await DocModel.findById(docId)
    if (!doc) return

    doc.status = 'processing'
    await doc.save()

    let extractedText = ''
    if (doc.sourceType === 'pdf') {
      const pdfBuffer = await getPdfBufferFromGridFs(doc.storageFileId)
      extractedText = await extractTextFromPdf(pdfBuffer)
    } else if (doc.sourceType === 'url') {
      extractedText = await extractTextFromUrl(doc.sourceUrl)
    }

    if (!extractedText.trim()) {
      throw new Error('No content could be extracted from source.')
    }

    const chunks = chunkText(extractedText)
    doc.chunkCount = chunks.length

    const index = getPineconeIndex()
    if (index && chunks.length > 0) {
      // Chunk batches for embeddings endpoint (e.g. max 50 per call)
      const embeddings = []
      const batchSize = 25
      for (let i = 0; i < chunks.length; i += batchSize) {
        const chunkBatch = chunks.slice(i, i + batchSize)
        const embedBatch = await getEmbeddings(chunkBatch, false)
        embeddings.push(...embedBatch)
      }

      await upsertDocumentToPinecone(doc._id, doc.user, doc.title, chunks, embeddings)
      doc.vectorCount = chunks.length
    }

    doc.status = 'completed'
    doc.errorMessage = null
    await doc.save()
    console.log(`Document processing completed successfully: ${docId} (${doc.title})`)

  } catch (error) {
    console.error(`Document processing failed for ${docId}:`, error.message)
    if (doc) {
      doc.status = 'failed'
      doc.errorMessage = error.message.slice(0, 300)
      await doc.save()
    }
  }
})

// Trigger processing in the background
export const enqueueDocumentProcessing = (docId) => {
  docEmitter.emit('process-doc', docId)
}
