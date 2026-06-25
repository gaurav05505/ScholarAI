export async function createNvidiaEmbeddings(chunks) {
  const apiKey = process.env.NVIDIA_API_KEY;
  const apiUrl = process.env.NVIDIA_EMBEDDING_API_URL;
  const model = process.env.NVIDIA_EMBEDDING_MODEL;

  if (!apiUrl) {
    throw new Error('NVIDIA_EMBEDDING_API_URL is missing');
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
      input: chunks,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`NVIDIA embeddings failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const embeddings = data.data || data.embeddings || data.output;

  if (!Array.isArray(embeddings)) {
    throw new Error('NVIDIA embeddings response format is not supported');
  }

  return embeddings.map((item) => item.embedding || item.values || item);
}
