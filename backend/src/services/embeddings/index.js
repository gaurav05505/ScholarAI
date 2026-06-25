import { createOpenAIEmbeddings } from './openai.embedding.js';
import { createNvidiaEmbeddings } from './nvidia.embedding.js';

export async function createEmbeddings(chunks) {
  const provider = (process.env.EMBEDDING_PROVIDER || 'openai').toLowerCase();

  if (provider === 'nvidia') {
    return createNvidiaEmbeddings(chunks);
  }

  return createOpenAIEmbeddings(chunks);
}
