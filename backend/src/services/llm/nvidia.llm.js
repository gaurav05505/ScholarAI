export async function generateNvidiaAnswer({ question, context }) {
  const apiKey = process.env.NVIDIA_API_KEY;
  const apiUrl = process.env.NVIDIA_CHAT_API_URL;
  const model = process.env.NVIDIA_CHAT_MODEL;

  if (!apiUrl) {
    throw new Error('NVIDIA_CHAT_API_URL is missing');
  }

  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is missing');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You answer only using the provided document context. If the context is insufficient, say you do not know.',
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nDocument context:\n${context}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`NVIDIA chat failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const answer =
    data.choices?.[0]?.message?.content?.trim() ||
    data.output?.[0]?.content?.[0]?.text?.trim() ||
    data.response?.trim() ||
    '';

  return {
    answer,
    model,
    provider: 'nvidia',
  };
}
