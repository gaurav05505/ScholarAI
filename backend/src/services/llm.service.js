import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const invokeUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';

export async function chatWithLLM(message, options = {}) {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is missing from environment variables.');
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const messages = Array.isArray(message)
    ? message
    : [
        {
          role: 'system',
          content:
            options.systemPrompt ||
            'You are ScolarAI, an expert AI assistant specialized in teaching students and researchers from first principles.',
        },
        {
          role: 'user',
          content: message,
        },
      ];

  const payload = {
    model: options.model || process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct',
    messages,
    max_tokens: options.max_tokens || 4096,
    temperature: options.temperature !== undefined ? options.temperature : 0.7,
    stream: false,
  };

  if (options.reasoning_effort) {
    payload.reasoning_effort = options.reasoning_effort;
  }

  try {
    const response = await axios.post(invokeUrl, payload, { headers, timeout: 20000 });
    return response.data?.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('NVIDIA LLM Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to generate AI response from NVIDIA model.'
    );
  }
}

export default chatWithLLM;