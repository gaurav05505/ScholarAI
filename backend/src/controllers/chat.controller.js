import { chatWithLLM } from "../services/llm.service.js";

export async function chat(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const answer = await chatWithLLM(message);

    return res.status(200).json({
      success: true,
      response: answer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}