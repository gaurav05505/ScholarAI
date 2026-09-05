import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const invokeUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function AIChat(systemPrompt, userMessage, options = {}) {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is missing from environment variables.');
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content:
        typeof userMessage === 'string'
          ? userMessage
          : JSON.stringify(userMessage),
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
    const { data } = await axios.post(invokeUrl, payload, { headers, timeout: 20000 });
    const contents = data.choices[0].message.content;

    try {
      return JSON.parse(contents);
    } catch {
      return contents;
    }
  } catch (error) {
    console.error('NVIDIA AIChat Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to generate AI response'
    );
  }
}

export default AIChat;