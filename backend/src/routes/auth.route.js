import express from 'express'; 
import authController from '../controllers/auth.controller.js'
import protect from '../middlewares/auth.middlerware.js'

const router = express.Router(); 

router.post("/user/register" , authController.userRegister )
router.post("/user/login" , authController.userLogin)
router.get("/user/me", protect, authController.getMe)

export default router; 

