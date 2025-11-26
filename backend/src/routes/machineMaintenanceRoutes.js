// backend/src/routes/machineMaintenanceRoutes.js
import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
    createMaintenanceLogController,
    updateMaintenanceLogStatusController,
    listMaintenanceLogsController,
    getMaintenanceLogController,
} from '../controllers/machineMaintenanceController.js';

const router = Router();

// Listar manutenções
router.get('/', authRequired, listMaintenanceLogsController);

// Ver detalhe
router.get('/:id', authRequired, getMaintenanceLogController);

// Criar manutenção (tipicamente só alguns roles)
router.post(
    '/',
    authRequired,
    requireRole('admin', 'engineer', 'maintenance', 'qc'),
    createMaintenanceLogController
);

// Atualizar status / fecho
router.patch(
    '/:id/status',
    authRequired,
    requireRole('admin', 'engineer', 'maintenance', 'qc'),
    updateMaintenanceLogStatusController
);

export default router;
