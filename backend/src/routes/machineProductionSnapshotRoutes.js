// backend/src/routes/machineProductionSnapshotRoutes.js
import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
    createMachineProductionSnapshotController,
    listMachineProductionSnapshotsController,
    getMachineProductionSnapshotController,
} from '../controllers/machineProductionSnapshotController.js';

const router = Router();

// Listar snapshots (qualquer user autenticado)
router.get(
    '/',
    authRequired,
    listMachineProductionSnapshotsController
);

// Ver detalhe de 1 snapshot
router.get(
    '/:id',
    authRequired,
    getMachineProductionSnapshotController
);

// Criar snapshot (ex: limitado a admin, engineer, qc)
router.post(
    '/',
    authRequired,
    requireRole('admin', 'engineer', 'qc'), // ajusta roles como quiseres
    createMachineProductionSnapshotController
);

export default router;
