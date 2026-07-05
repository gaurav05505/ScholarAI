import { chatWithLLM } from "../services/llm.service.js";
import { intentNode } from "../node/intent.node.js";
import { contextNode } from "../node/context.node.js";
import LearnSchema from "../models/Learn.Schema.js";
import Roadmap from "../models/Roadmap.mode.js";
import Aichat from "../utils/aiClint.util.js";
import mongoose from "mongoose";

export async function chat(req, res) {
  try {
    const { message, userId, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (sessionId) {
      const session = await LearnSchema.findById(sessionId);
      if (session && session.status === "completed") {
        let roadmapStructure = "No roadmap details available.";
        if (session.roadmapId) {
          const roadmapObj = await Roadmap.findById(session.roadmapId);
          if (roadmapObj) {
            roadmapStructure = roadmapObj.phases.map((phase, pIdx) => {
              const modulesText = phase.modules.map((mod, mIdx) => {
                const topicsText = mod.topics.map(t => `- ${t.name}`).join("\n");
                return `Module ${pIdx+1}.${mIdx+1}: ${mod.name}\n${topicsText}`;
              }).join("\n\n");
              return `Phase ${pIdx+1}: ${phase.name}\n${modulesText}`;
            }).join("\n\n---\n\n");
          }
        }

        const tutorPrompt = `You are ScolarAI, an AI learning tutor.
The user is learning the topic: "${session.topic}".
Their profile/context:
- Track/Focus: ${session.context?.track || 'General'}
- Level: ${session.context?.level || 'Beginner'}
- Goal: ${session.context?.goal || 'General study'}
- Learning Style: ${session.context?.learningStyle || 'Standard'}

Their actual generated Roadmap is structured as follows:
${roadmapStructure}

Help the user by answering their questions contextually, explaining concepts, or guiding them through their roadmap. 
IMPORTANT: Do NOT output or re-generate the entire syllabus or roadmap structure in your response. The user can already see the visual roadmap on their screen. Instead, refer to specific topics in their roadmap, guide them on what to click next, and answer their learning questions from first principles.
Make your response clean, professional, and formatted in rich Markdown.`;

        const answer = await Aichat(tutorPrompt, message);
        return res.status(200).json({
          success: true,
          response: answer,
        });
      }

      const contextResult = await contextNode(sessionId, message);
      return res.status(200).json(contextResult);
    }

    // Generate or use a standard userId for the session
    const activeUserId = userId || new mongoose.Types.ObjectId();

    // Mock command for testing rich markdown rendering
    if (message === "test markdown rendering") {
      return res.status(200).json({
        success: true,
        response: `# 🚀 Awesome! Let's Start Your Web Dev Journey!

Welcome! I'm excited to help you learn web development. Let's set you up with a clear roadmap.

---

## 🎯 The Big Picture: 3 Core Skills

Web development has three main pillars:

| Pillar | What It Does | Example |
|--------|--------------|---------|
| HTML | Structure/content | Headings, paragraphs, images |
| CSS | Styling/looks | Colors, fonts, layouts |
| JavaScript | Behavior/interactivity | Buttons that do things, animations |

---

## 🛤️ Recommended Learning Path

### Phase 1: Foundations (Week 1-2)
1. HTML basics — tags, elements, structure
2. CSS basics — colors, fonts, box model
3. Build a simple personal webpage

---

> This is a sample blockquote showing left border, background padding, and italics.

And check out this task list:
- [ ] Task 1 to complete
- [x] Task 2 is already finished!

Here is inline \`const name = "ScolarAI";\` and a code block:
\`\`\`javascript
function greet(user) {
  console.log("Hello, " + user);
}
\`\`\`
`
      });
    }

    // Call intentNode to determine if this is a learning request
    const intentResult = await intentNode(activeUserId, message);

    if (intentResult.success && intentResult.intent === "learn") {
      // If intent is learn, return the next onboarding question structured JSON
      return res.status(200).json(intentResult);
    }

    // Fall back to standard chat response
    const answer = await chatWithLLM(message);

    return res.status(200).json({
      success: true,
      response: answer,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}