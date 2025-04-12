import express from 'express';
import { registerController, loginController, infoController, logoutController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register/', registerController);
router.post('/login/', loginController);
router.post('/info/', infoController);
router.post('/logout/', logoutController);

export default router;