import {intentNode} from '../node/intent.node.js'; 
import Roadmap from '../models/Roadmap.mode.js';
import LearnSchema from '../models/Learn.Schema.js'; 
import Project from '../models/Project.model.js';
import UserModel from '../models/user.model.js';
import { lessonPrompt } from '../Prompt/lesson.prompt.js';
import Aichat from '../utils/aiClint.util.js'; 
import jwt from 'jsonwebtoken';

const getActiveUser = async (req) => {
    if (req.user && req.user._id) {
        return req.user._id;
    }
    
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(decoded.id);
            if (user) return user._id;
        }
    } catch (err) {
        // ignore
    }

    let defaultUser = await UserModel.findOne({ email: "scolar.learner@scolarai.com" });
    if (!defaultUser) {
        defaultUser = await UserModel.create({
            name: "Scolar Learner",
            email: "scolar.learner@scolarai.com",
            password: "defaultpassword123"
        });
    }
    return defaultUser._id;
};

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

export const createProject = async (req, res) => {
    try {
        const { sessionId, topic, title } = req.body;
        const activeUserId = await getActiveUser(req);

        let project;

        if (!sessionId) {
            if (!topic) {
                return res.status(400).json({
                    success: false,
                    message: "topic is required when creating a project directly."
                });
            }
            project = await Project.create({
                user: activeUserId,
                topic: topic,
                title: title || topic,
                description: req.body.description || "",
                chats: []
            });
            return res.status(200).json({
                success: true,
                message: "Project successfully created in database!",
                project,
                projectCreated: true
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

        project = await Project.findOne({ sessionId: session._id });
        if (!project) {
            project = await Project.create({
                user: activeUserId,
                topic: roadmap.topic,
                title: title || roadmap.title,
                description: req.body.description || roadmap.description || "",
                roadmapId: roadmap._id,
                sessionId: session._id,
                chats: []
            });
        }

        // Mark project as created in the session
        session.projectCreated = true;
        await session.save();

        return res.status(200).json({
            success: true,
            message: "Project successfully created in database!",
            project,
            projectCreated: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const listProjects = async (req, res) => {
    try {
        const activeUserId = await getActiveUser(req);
        const projects = await Project.find({ user: activeUserId }).sort({ updatedAt: -1 });
        return res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate('roadmapId');
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }
        return res.status(200).json({
            success: true,
            project
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const saveProjectChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { chat } = req.body;
        
        if (!id || !chat || !chat.id || !chat.title || !chat.messages) {
            return res.status(400).json({
                success: false,
                message: "projectId, and chat (with id, title, messages) are required."
            });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        const existingIdx = project.chats.findIndex(c => String(c.id) === String(chat.id));
        if (existingIdx > -1) {
            project.chats[existingIdx].messages = chat.messages;
            project.chats[existingIdx].title = chat.title;
            project.chats[existingIdx].id = chat.id;
        } else {
            project.chats.push({
                id: chat.id,
                title: chat.title,
                messages: chat.messages
            });
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project chat saved successfully!"
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

export const listRoadmaps = async (req, res) => {
    try {
        const activeUserId = await getActiveUser(req);
        const roadmaps = await Roadmap.find({ userId: activeUserId }).sort({ updatedAt: -1 });
        return res.status(200).json({
            success: true,
            roadmaps
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const renameRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "title is required."
            });
        }

        const roadmap = await Roadmap.findByIdAndUpdate(id, { title }, { new: true });
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Roadmap renamed successfully!",
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

export const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const roadmap = await Roadmap.findByIdAndDelete(id);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Roadmap deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const renameProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "title is required."
            });
        }

        const project = await Project.findByIdAndUpdate(id, { title }, { new: true });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project renamed successfully!",
            project
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteProjectChat = async (req, res) => {
    try {
        const { id, chatId } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }
        project.chats = project.chats.filter(c => String(c.id) !== String(chatId));
        await project.save();
        return res.status(200).json({
            success: true,
            message: "Project chat deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}