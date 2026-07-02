import express from 'express'; 
import {startLearning} from '../controllers/learning.controller.js'

const router = express.Router(); 

router.post("/start" , startLearning); 

export default router; 