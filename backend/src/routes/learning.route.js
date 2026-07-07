import express from 'express'; 
import {
    startLearning, 
    getRoadmap, 
    toggleTopicCompletion,
    createProject,
    listProjects,
    getProjectDetails,
    saveProjectChat,
    explainTopic,
    listRoadmaps,
    renameRoadmap,
    renameProject,
    deleteProject,
    deleteProjectChat
} from '../controllers/learning.controller.js'

const router = express.Router(); 

router.post("/start" , startLearning); 
router.get("/roadmap/:id", getRoadmap);
router.post("/roadmap/:id/toggle-topic", toggleTopicCompletion);
router.post("/create-project", createProject);
router.get("/projects", listProjects);
router.get("/projects/:id", getProjectDetails);
router.post("/projects/:id/chats", saveProjectChat);
router.post("/explain-topic", explainTopic);
router.get("/roadmaps", listRoadmaps);
router.patch("/roadmap/:id", renameRoadmap);
router.patch("/projects/:id", renameProject);
router.delete("/projects/:id", deleteProject);
router.delete("/projects/:id/chats/:chatId", deleteProjectChat);

export default router;  