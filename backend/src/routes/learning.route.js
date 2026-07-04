import express from 'express'; 
import {
    startLearning, 
    getRoadmap, 
    toggleTopicCompletion,
    createProjectFiles,
    explainTopic,
    logQuery
} from '../controllers/learning.controller.js'

const router = express.Router(); 

router.post("/start" , startLearning); 
router.get("/roadmap/:id", getRoadmap);
router.post("/roadmap/:id/toggle-topic", toggleTopicCompletion);
router.post("/create-project", createProjectFiles);
router.post("/explain-topic", explainTopic);
router.post("/log-query", logQuery);

export default router;  