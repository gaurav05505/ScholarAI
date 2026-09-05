export const DEFAULT_QUESTIONS = {
  track: (topic = "this topic") => ({
    field: "track",
    question: `What specific area or track of ${topic} do you want to focus on?`,
    options: [
      "Fundamentals & Core Architecture",
      "Practical Hands-on Projects",
      "Interview Preparation",
      "Advanced Deep Dive"
    ],
    allowCustom: true,
  }),
  level: (topic = "this topic") => ({
    field: "level",
    question: `What is your current experience level with ${topic}?`,
    options: [
      "Beginner (Starting fresh)",
      "Intermediate (Know the basics)",
      "Advanced (Experienced practitioner)"
    ],
    allowCustom: true,
  }),
  goal: (topic = "this topic") => ({
    field: "goal",
    question: `What is your primary goal for learning ${topic}?`,
    options: [
      "Master core concepts from first principles",
      "Prepare for technical interviews",
      "Build scalable production applications",
      "Academic / Research mastery"
    ],
    allowCustom: true,
  }),
  weeklyHours: (topic = "this topic") => ({
    field: "weeklyHours",
    question: `How many hours per week can you dedicate to studying ${topic}?`,
    options: [
      "3-5 hours / week (Casual)",
      "5-10 hours / week (Consistent)",
      "10-20 hours / week (Dedicated)",
      "20+ hours / week (Intensive)"
    ],
    allowCustom: true,
  }),
  learningStyle: (topic = "this topic") => ({
    field: "learningStyle",
    question: `What learning style works best for you?`,
    options: [
      "First-Principles & Deep Theory",
      "Code-First & Hands-on Examples",
      "Visual Diagrams & Architectural Walkthroughs",
      "Socratic Q&A & Flashcards"
    ],
    allowCustom: true,
  }),
};

export function getFallbackQuestion(field, topic) {
  if (DEFAULT_QUESTIONS[field]) {
    return DEFAULT_QUESTIONS[field](topic);
  }
  return {
    field,
    question: `What are your preferences for ${field} regarding ${topic}?`,
    options: ["Standard", "Focused", "Comprehensive"],
    allowCustom: true,
  };
}

