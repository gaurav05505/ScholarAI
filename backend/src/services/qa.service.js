import { queryRelevantChunks } from './vector.service.js';
import { generateAnswer } from './llm/index.js';

function buildContext(chunks) {
  if (!chunks.length) {
    return 'No relevant document context was found.';
  }

  return chunks
    .map((chunk, index) => `Chunk ${index + 1}: ${chunk.text}`)
    .join('\n\n');
}

export async function answerDocumentQuestion({ doc, question, userId }) {
  const sources = await queryRelevantChunks({
    userId,
    docId: doc._id,
    question,
    topK: 5,
  });

  const context = buildContext(sources);
  const completion = await generateAnswer({
    question,
    context,
  });

  return {
    answer: completion.answer,
    provider: completion.provider,
    model: completion.model,
    sources,
  };
}
