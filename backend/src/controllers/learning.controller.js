import {intentNode} from '../node/intent.node.js'; 
import Roadmap from '../models/Roadmap.mode.js';
import LearnSchema from '../models/Learn.Schema.js'; 
import { lessonPrompt } from '../Prompt/lesson.prompt.js';
import Aichat from '../utils/aiClint.util.js'; 
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../');

export const startLearning = async(req , res) => {
    try {
        
        const {userId , message} = req.body; 

        if(!userId || !message ){
            return res.status(400).json({
                success: false,
                message: "userId and message are required.",
            })
        }

        const result = await intentNode(userId , message);

        return res.status(200).json(result); 


    } catch (error) {
        console.error(error);

        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

export const getRoadmap = async(req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Roadmap ID is required."
            });
        }
        
        const roadmap = await Roadmap.findById(id);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            roadmap
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const toggleTopicCompletion = async(req, res) => {
    try {
        const { id } = req.params;
        const { phaseIndex, moduleIndex, topicIndex } = req.body;
        
        if (phaseIndex === undefined || moduleIndex === undefined || topicIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: "phaseIndex, moduleIndex, and topicIndex are required."
            });
        }
        
        const roadmap = await Roadmap.findById(id);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }
        
        const topic = roadmap.phases[phaseIndex]?.modules[moduleIndex]?.topics[topicIndex];
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic not found."
            });
        }
        
        topic.completed = !topic.completed;
        await roadmap.save();
        
        return res.status(200).json({
            success: true,
            roadmap
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const createProjectFiles = async (req, res) => {
    try {
        const { sessionId, topic } = req.body;
        if (!sessionId || !topic) {
            return res.status(400).json({
                success: false,
                message: "sessionId and topic are required."
            });
        }

        const session = await LearnSchema.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Learning session not found."
            });
        }

        const roadmap = await Roadmap.findById(session.roadmapId);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found. Complete onboarding first."
            });
        }

        // Format the roadmap to markdown
        let md = `# 🗺️ Learning Roadmap: ${roadmap.title}\n\n`;
        md += `**Subject**: ${roadmap.topic}\n`;
        md += `**Description**: ${roadmap.description}\n\n`;
        md += `--- \n\n`;

        roadmap.phases.forEach((phase, pIdx) => {
            md += `## 🚀 Phase ${pIdx + 1}: ${phase.name}\n`;
            md += `> ${phase.description}\n\n`;

            phase.modules.forEach((mod, mIdx) => {
                md += `### 📦 Module ${pIdx + 1}.${mIdx + 1}: ${mod.name}\n`;
                md += `*${mod.description}*\n\n`;
                md += `**Topics Checklist**:\n`;
                mod.topics.forEach((top) => {
                    const status = top.completed ? 'x' : ' ';
                    md += `- [${status}] ${top.name}\n`;
                });
                md += `\n`;
            });
            md += `--- \n\n`;
        });

        // Slugify topic for folder name
        const folderSlug = topic.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
        const projectDir = path.join(workspaceRoot, 'projects', folderSlug);

        // Create folders
        await fs.mkdir(projectDir, { recursive: true });

        // Write files
        const roadmapPath = path.join(projectDir, 'roadmap.md');
        const queriesPath = path.join(projectDir, 'queries.md');

        await fs.writeFile(roadmapPath, md, 'utf8');

        // Create queries file if it doesn't exist
        try {
            await fs.access(queriesPath);
        } catch {
            const initialQueriesContent = `# 💬 Study Notes & Queries: ${topic}\n\nThis file logs all your questions and AI explanations for this topic.\n\n`;
            await fs.writeFile(queriesPath, initialQueriesContent, 'utf8');
        }

        return res.status(200).json({
            success: true,
            message: "Project files successfully generated!",
            projectDir: `projects/${folderSlug}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const explainTopic = async (req, res) => {
    try {
        const { topic, subject } = req.body;
        if (!topic || !subject) {
            return res.status(400).json({
                success: false,
                message: "topic and subject are required."
            });
        }

        // Interpolate prompt
        const formattedPrompt = lessonPrompt
            .replace('${topic}', topic)
            .replace('${subject}', subject);

        const explanation = await Aichat(formattedPrompt, `Explain the topic: "${topic}"`);

        return res.status(200).json({
            success: true,
            explanation
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const logQuery = async (req, res) => {
    try {
        const { subject, query, response } = req.body;
        if (!subject || !query || !response) {
            return res.status(400).json({
                success: false,
                message: "subject, query, and response are required."
            });
        }

        const folderSlug = subject.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
        const projectDir = path.join(workspaceRoot, 'projects', folderSlug);
        const queriesPath = path.join(projectDir, 'queries.md');

        // Check if directory exists (if not, we write it in projects folder)
        await fs.mkdir(projectDir, { recursive: true });

        const logEntry = `\n## ❓ Query: ${query}\n*Logged on: ${new Date().toLocaleString()}*\n\n${response}\n\n---\n`;

        await fs.appendFile(queriesPath, logEntry, 'utf8');

        return res.status(200).json({
            success: true,
            message: "Query logged successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}