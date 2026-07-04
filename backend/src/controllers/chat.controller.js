import { chatWithLLM } from "../services/llm.service.js";
import { intentNode } from "../node/intent.node.js";
import mongoose from "mongoose";

export async function chat(req, res) {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
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