import nvidia from "../config/nvidia.js";

export async function chatWithLLM(message) {
  try {
    const response = await nvidia.post("/chat/completions", {
      model: "minimaxai/minimax-m3",

      messages: [
        {
          role: "system",
          content:
            "You are ScolarAI, an AI assistant specialized in helping students and researchers.",
        },
        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 4096,
      stream: false,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );

    throw new Error("Failed to generate AI response.");
  }
}