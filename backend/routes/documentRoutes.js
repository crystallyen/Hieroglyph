import express from 'express';
import {createDocument, getDocument, getDocuments, renameDocument, updateDocumentContent} from '../controllers/documentController.js';

const router = express.Router();

router.get('/', getDocuments);
router.post('/create', createDocument);
router.get('/:documentId', getDocument);
router.put('/:documentId', updateDocumentContent);
router.put('/:documentId/rename', renameDocument);

export default router;