import Aichat from '../utils/aiClint.util.js'; 
import { contextPrompt } from '../Prompt/context.prompt.js';
import LearnSchema from '../models/Learn.Schema.js'; 
import { Learning_Fields } from '../constants/learningField.constant.js';
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

      let questionRes;
      try {
        questionRes = await Aichat(contextPrompt, promptInput);
      } catch (aiError) {
        console.error(`[Context Node] AI Error:`, aiError);
        return {
          success: false,
          message: `AI error during question generation: ${aiError.message}`
        };
      }

      console.log(`[Context Node] Raw AI Response:`, questionRes);

      let nextQuestion;
      try {
        nextQuestion = cleanAndParseJSON(questionRes);
      } catch (parseError) {
        console.error(`[Context Node] Parse Error:`, parseError);
        return {
          success: false,
          message: "Invalid JSON returned by AI for onboarding question."
        };
      }

      console.log(`[Context Node] Parsed AI Response:`, JSON.stringify(nextQuestion, null, 2));

      if (!nextQuestion || typeof nextQuestion !== 'object') {
        return {
          success: false,
          message: "Unexpected response format for onboarding question."
        };
      }

      const { field, question, options, allowCustom } = nextQuestion;
      if (!field || !question || !Array.isArray(options)) {
        return {
          success: false,
          message: "Onboarding question missing required fields (field, question, or options)."
        };
      }

      await session.save();

      return {
        success: true,
        sessionId: session._id,
        status: session.status,
        nextQuestion: {
          field,
          question,
          options,
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
