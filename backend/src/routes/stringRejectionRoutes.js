import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import {
    createStringRejectionController,
    listStringRejectionsController,
} from '../controllers/stringRejectionController.js';

const router = Router();

// listar com filtros via querystring
router.get('/', authRequired, listStringRejectionsController);

// registar uma rejeição
router.post('/', authRequired, createStringRejectionController);

export default router;
