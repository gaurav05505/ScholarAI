import Aichat from '../utils/aiClint.util.js'; 
import { intentPrompt } from '../Prompt/intent.prompt.js';
import { contextPrompt } from '../Prompt/context.prompt.js';
import LearnSchema from '../models/Learn.Schema.js'; 
import { getFallbackQuestion } from '../constants/learningQuestion.constant.js';

/**
 * Safely extracts and parses JSON content from AI responses.
 */
function cleanAndParseJSON(str) {
  if (typeof str !== 'string') return str;
  let cleaned = str.trim();
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(cleaned);
}

export async function intentNode(userId, message) {
  try {
    if (!userId || !message) {
      return {
        success: false,
        message: "userId and message are required."
      };
    }

    // 1. Call Intent Prompt
    let Aires;
    try {
      Aires = await Aichat(intentPrompt, message);
    } catch (aiError) {
      // If AI intent classification fails, check heuristic
      const lower = message.toLowerCase();
      if (lower.includes("learn") || lower.includes("roadmap") || lower.includes("study") || lower.includes("guide")) {
        const words = message.replace(/i want to learn|how to learn|teach me|roadmap for/gi, '').trim();
        Aires = JSON.stringify({ intent: "learn", topic: words || "Web Development" });
      } else {
        return {
          success: false,
          message: `AI service error: ${aiError.message}`
        };
      }
    }

    // 2. Parse JSON safely
    let result;
    try {
      result = cleanAndParseJSON(Aires);
    } catch (parseError) {
      return {
        success: false,
        message: "Invalid JSON returned by AI for intent classification."
      };
    }

    // 3. Handle invalid AI responses
    if (!result || !result.intent) {
      return {
        success: false,
        message: "AI didn't return an intent."
      };
    }

    const intent = result.intent.toLowerCase();

    // 4. If intent !== "learn", return immediately
    if (intent !== "learn") {
      return {
        success: true,
        intent: result.intent,
        data: result,
      };
    }

    // Validation for topic when intent is "learn"
    if (!result.topic) {
      return {
        success: false,
        message: "Topic not identified for learn intent."
      };
    }

    // 5. Create LearningSession
    let session;
    try {
      session = await LearnSchema.create({
        userId,
        topic: result.topic,
        status: "collecting_context",
        currentField: "track",
        context: {},
      });
    } catch (dbError) {
      return {
        success: false,
        message: `MongoDB failure: ${dbError.message}`
      };
    }

    // 6. Call Context Question Prompt
    const userMsg = `Topic: ${result.topic}
Current Field: track
Already Collected Context: {}`;

    let nextQuestion = null;
    try {
      const questionRes = await Aichat(contextPrompt, userMsg);
      const parsed = cleanAndParseJSON(questionRes);
      if (parsed && parsed.question && Array.isArray(parsed.options)) {
        nextQuestion = parsed;
      }
    } catch (aiError) {
      console.warn(`[Intent Node] AI question generation fallback used:`, aiError.message);
    }

    // Fallback if AI fails
    if (!nextQuestion) {
      nextQuestion = getFallbackQuestion("track", result.topic);
    }

    const { field, question, options, allowCustom } = nextQuestion;

    // 7. Return session and next question info
    return {
      success: true,
      sessionId: session._id,
      intent: result.intent,
      topic: result.topic,
      nextQuestion: {
        field: field || "track",
        question,
        options: options || ["Core Fundamentals", "Practical Projects", "Deep Dive"],
        allowCustom: allowCustom !== undefined ? allowCustom : true
      }
    };

  } catch (error) {
    console.error("Intent Node Error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred."
    };
  }
}
