import express from 'express';
import {createDocument, getDocument, getDocuments, renameDocument, updateDocumentContent, deleteDocument} from '../controllers/documentController.js';

const router = express.Router();

router.get('/', getDocuments);
router.post('/create', createDocument);
router.get('/:documentId', getDocument);
router.put('/:documentId', updateDocumentContent);
router.put('/:documentId/rename', renameDocument);
router.delete('/:documentId', deleteDocument);

export default router;