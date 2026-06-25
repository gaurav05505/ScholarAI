import express from 'express';
import docController from '../controllers/doc.controller.js';
import protect from '../middlewares/auth.middlerware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), docController.uploadDoc);
router.post('/:id/ask', protect, docController.askDocQuestion);
router.get('/', protect, docController.listDocs);
router.get('/:id', protect, docController.getDocById);
router.patch('/:id', protect, docController.updateDoc);
router.delete('/:id', protect, docController.deleteDoc);

export default router;
