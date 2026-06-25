import express from 'express'; 
import authController from '../controllers/auth.controller.js'

const router = express.Router(); 

router.post("/user/register" , authController.userRegister )
router.post("/user/login" , authController.userLogin)

export default router; 

