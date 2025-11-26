// backend/src/routes/ribbonSpoolRoutes.js
import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
    createRibbonSpoolController,
    updateRibbonSpoolController,
    listRibbonSpoolsController,
    getRibbonSpoolController,
} from '../controllers/ribbonSpoolController.js';

const router = Router();

// Listar spools
router.get('/', authRequired, listRibbonSpoolsController);

// Ver detalhe
router.get('/:id', authRequired, getRibbonSpoolController);

// Criar spool (normalmente engineer / qc / lead)
router.post(
    '/',
    authRequired,
    requireRole('admin', 'engineer', 'qc', 'lead'),
    createRibbonSpoolController
);

// Atualizar (fechar spool, atualizar peso, etc.)
router.patch(
    '/:id',
    authRequired,
    requireRole('admin', 'engineer', 'qc', 'lead'),
    updateRibbonSpoolController
);

export default router;
