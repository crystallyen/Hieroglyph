import express from 'express';
import {createDocument, getDocument, getDocuments, updateDocumentContent} from '../controllers/documentController.js';

const router = express.Router();

router.get('/', getDocuments);
router.post('/create', createDocument);
router.get('/:documentId', getDocument);
router.put('/:documentId', updateDocumentContent);

export default router;