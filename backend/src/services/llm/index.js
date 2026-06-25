import { generateOpenAIAnswer } from './openai.llm.js';
import { generateNvidiaAnswer } from './nvidia.llm.js';

export async function generateAnswer(payload) {
  const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

  if (provider === 'nvidia') {
    return generateNvidiaAnswer(payload);
  }

  return generateOpenAIAnswer(payload);
}
