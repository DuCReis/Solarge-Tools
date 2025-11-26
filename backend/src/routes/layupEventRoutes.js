// backend/src/routes/layupEventRoutes.js
import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
    createLayupEventController,
    listLayupEventsController,
    getLayupEventController,
} from '../controllers/layupEventController.js';

const router = Router();

// Listar eventos de layup
router.get('/', authRequired, listLayupEventsController);

// Detalhe
router.get('/:id', authRequired, getLayupEventController);

// Criar evento (normalmente engineer/qc/lead + possívelmente operador logado)
router.post(
    '/',
    authRequired,
    requireRole('admin', 'engineer', 'qc', 'lead', 'operator'),
    createLayupEventController
);

export default router;
