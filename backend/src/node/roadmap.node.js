import Aichat from '../utils/aiClint.util.js'; 
import { roadmapPrompt } from '../Prompt/roadmap.prompt.js';
import LearnSchema from '../models/Learn.Schema.js'; 
import Roadmap from '../models/Roadmap.mode.js';

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

export async function roadmapNode(sessionId) {
  try {
    if (!sessionId) {
      throw new Error("sessionId is required to generate roadmap.");
    }

    // 1. Retrieve the session
    const session = await LearnSchema.findById(sessionId);
    if (!session) {
      throw new Error("Learning session not found.");
    }

    // 2. If roadmap already exists, return it
    if (session.roadmapId) {
      const existingRoadmap = await Roadmap.findById(session.roadmapId);
      if (existingRoadmap) {
        return existingRoadmap;
      }
    }

    // 3. Build prompt input using the collected context
    const context = session.context || {};
    const promptInput = `Topic: ${session.topic}
Track: ${context.track || 'Not specified'}
Level: ${context.level || 'Not specified'}
Goal: ${context.goal || 'Not specified'}
Weekly Hours: ${context.weeklyHours || 'Not specified'}
Learning Style: ${context.learningStyle || 'Not specified'}`;

    console.log(`[Roadmap Node] Requesting LLM for topic: ${session.topic}`);
    console.log(`[Roadmap Node] Prompt input:\n${promptInput}`);

    // 4. Generate the roadmap JSON using LLM
    let aiRes;
    try {
      aiRes = await Aichat(roadmapPrompt, promptInput);
    } catch (aiError) {
      throw new Error(`AI generation failed: ${aiError.message}`);
    }

    console.log(`[Roadmap Node] Raw AI response:`, aiRes);

    // 5. Parse output
    let parsed;
    try {
      parsed = cleanAndParseJSON(aiRes);
    } catch (parseError) {
      throw new Error(`Invalid JSON format returned by AI: ${parseError.message}`);
    }

    if (!parsed || !parsed.title || !Array.isArray(parsed.phases)) {
      throw new Error("AI response did not follow the required JSON schema structure.");
    }

    console.log(`[Roadmap Node] Parsed roadmap title: ${parsed.title}`);

    // 6. Create Roadmap in database
    const roadmap = await Roadmap.create({
      userId: session.userId,
      title: parsed.title,
      topic: session.topic,
      description: parsed.description || "",
      phases: parsed.phases
    });

    // 7. Associate the roadmap with the session
    session.roadmapId = roadmap._id;
    await session.save();

    console.log(`[Roadmap Node] Roadmap saved with ID: ${roadmap._id}`);
    return roadmap;

  } catch (error) {
    console.error("Roadmap Node Error:", error);
    throw error;
  }
}
