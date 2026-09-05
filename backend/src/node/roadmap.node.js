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

function getDefaultRoadmap(topic, context = {}) {
  const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  const track = context.track || 'Core Architecture';
  const level = context.level || 'Beginner';

  return {
    title: `${capTopic} First-Principles Roadmap`,
    description: `A personalized, high-yield learning path for ${topic} (${track}, ${level}) built on first principles.`,
    phases: [
      {
        name: "Phase 1: Foundations & Core Mental Models",
        modules: [
          {
            name: `${capTopic} Fundamentals`,
            description: `Understanding the first principles, primitives, and core mechanisms of ${topic}.`,
            topics: [
              { name: "Underlying First Principles & Primitives", completed: false },
              { name: "Core Architecture & Data Flow", completed: false },
              { name: "Building Foundational Blocks", completed: false }
            ]
          },
          {
            name: "Core Mechanics & Patterns",
            description: `Deep dive into architectural patterns and system design tradeoffs.`,
            topics: [
              { name: "Execution Flow & Critical Invariants", completed: false },
              { name: "Standard Design Patterns & Best Practices", completed: false },
              { name: "Common Edge Cases & Failure Modes", completed: false }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Scalability, Optimization & Production",
        modules: [
          {
            name: "Production-Grade System Architecture",
            description: `High-throughput optimization, monitoring, and real-world system design.`,
            topics: [
              { name: "Performance Bottlenecks & Optimization", completed: false },
              { name: "Reliability, Resiliency & Redundancy", completed: false },
              { name: "End-to-End Real World System Integration", completed: false }
            ]
          }
        ]
      }
    ]
  };
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

    // 4. Generate the roadmap JSON using LLM with fallback
    let parsed = null;
    try {
      const aiRes = await Aichat(roadmapPrompt, promptInput, { timeout: 45000 });
      console.log(`[Roadmap Node] Raw AI response:`, aiRes);
      parsed = cleanAndParseJSON(aiRes);
    } catch (aiError) {
      console.warn(`[Roadmap Node] AI generation fallback used:`, aiError.message);
    }

    if (!parsed || !parsed.title || !Array.isArray(parsed.phases) || parsed.phases.length === 0) {
      console.log(`[Roadmap Node] Using high-yield structured default roadmap template for ${session.topic}`);
      parsed = getDefaultRoadmap(session.topic, context);
    }

    console.log(`[Roadmap Node] Parsed roadmap title: ${parsed.title}`);

    // 5. Create Roadmap in database
    const roadmap = await Roadmap.create({
      userId: session.userId,
      title: parsed.title,
      topic: session.topic,
      description: parsed.description || "",
      phases: parsed.phases
    });

    // 6. Associate the roadmap with the session
    session.roadmapId = roadmap._id;
    await session.save();

    console.log(`[Roadmap Node] Roadmap saved with ID: ${roadmap._id}`);
    return roadmap;

  } catch (error) {
    console.error("Roadmap Node Error:", error);
    throw error;
  }
}
