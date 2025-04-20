import express from 'express';
import {handleSummarize, handleBulletify, handleParaphrase, handleProofread} from "../controllers/modelController.js";

const router = express.Router();

router.post('/summarize', handleSummarize);
router.post('/bulletify', handleBulletify);
router.post('/paraphrase', handleParaphrase);
router.post('/proofread', handleProofread);

export default router;