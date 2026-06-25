export async function generateOpenAIAnswer({ question, context }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    throw new Error(`OpenAI chat failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return {
    answer: data.choices?.[0]?.message?.content?.trim() || '',
    model,
    provider: 'openai',
  };
}
