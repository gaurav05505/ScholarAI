import Aichat from '../utils/aiClint.util.js'; 
import { contextPrompt } from '../Prompt/context.prompt.js';
import LearnSchema from '../models/Learn.Schema.js'; 
import { Learning_Fields } from '../constants/learningField.constant.js';
import { getFallbackQuestion } from '../constants/learningQuestion.constant.js';
import { roadmapNode } from './roadmap.node.js';

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

export async function contextNode(sessionId, message) {
  try {
    if (!sessionId || !message) {
      return {
        success: false,
        message: "sessionId and message are required."
      };
    }

    // 1. Retrieve the session
    const session = await LearnSchema.findById(sessionId);
    if (!session) {
      return {
        success: false,
        message: "Learning session not found."
      };
    }

    // 2. Check if already completed
    if (session.status !== "collecting_context") {
      return {
        success: false,
        message: "Onboarding is already completed for this session."
      };
    }

    // 3. Save the response for the current field
    const currentField = session.currentField || "track";
    
    // Convert to plain object to avoid copying Mongoose document internals
    const contextObj = session.context && typeof session.context.toObject === 'function'
      ? session.context.toObject()
      : { ...session.context };

    contextObj[currentField] = message;
    session.context = contextObj;
    session.markModified('context');

    console.log(`[Context Node] Saved field "${currentField}": "${message}"`);
    console.log(`[Context Node] Updated context:`, JSON.stringify(contextObj));

    // 4. Find the next field
    const currentIndex = Learning_Fields.indexOf(currentField);
    const nextField = Learning_Fields[currentIndex + 1];

    if (nextField) {
      // Move to next field
      session.currentField = nextField;

      // Call AI to generate next onboarding question
      const promptInput = `Topic: ${session.topic}
Current Field: ${nextField}
Already Collected Context: ${JSON.stringify(contextObj)}`;

      console.log(`[Context Node] Calling LLM with prompt:\n${promptInput}`);

      let nextQuestion = null;
      try {
        const questionRes = await Aichat(contextPrompt, promptInput);
        console.log(`[Context Node] Raw AI Response:`, questionRes);
        const parsed = cleanAndParseJSON(questionRes);
        if (parsed && parsed.question && Array.isArray(parsed.options)) {
          nextQuestion = parsed;
        }
      } catch (aiError) {
        console.warn(`[Context Node] AI question generation fallback used:`, aiError.message);
      }

      // If AI fails or timed out, use guaranteed intelligent fallback
      if (!nextQuestion) {
        nextQuestion = getFallbackQuestion(nextField, session.topic);
      }

      const { field, question, options, allowCustom } = nextQuestion;

      await session.save();

      return {
        success: true,
        sessionId: session._id,
        status: session.status,
        nextQuestion: {
          field: field || nextField,
          question,
          options: options || ["Option 1", "Option 2"],
          allowCustom: allowCustom !== undefined ? allowCustom : true
        }
      };

    } else {
      // No more fields left. Onboarding is complete!
      session.status = "completed";
      session.currentField = null;
      await session.save();

      // Automatically generate the roadmap inline
      let generatedRoadmap = null;
      try {
        generatedRoadmap = await roadmapNode(session._id);
      } catch (roadmapError) {
        console.error("Auto-generation of roadmap failed:", roadmapError);
      }

      return {
        success: true,
        sessionId: session._id,
        status: "completed",
        message: "All onboarding details collected! Generating your personalized roadmap...",
        roadmap: generatedRoadmap
      };
    }

  } catch (error) {
    console.error("Context Node Error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred during context collection."
    };
  }
}
