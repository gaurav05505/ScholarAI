import axios from "axios";

const client = axios.create({
  baseURL: "https://integrate.api.nvidia.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    "Content-Type": "application/json",
  },
});

async function AIChat(systemPrompt, userMessage) {
  try {
    const { data } = await client.post("/chat/completions", {
      model: "moonshotai/kimi-k2.6",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],

      temperature: 0.7,
      top_p: 1,
      max_tokens: 4096,
      stream: false,
    });

    const contents = data.choices[0].message.content;

    try {
        return JSON.parse(contents)
    } catch (error) {
        return contents
    }


  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to generate AI response");
  }
}

export default AIChat;