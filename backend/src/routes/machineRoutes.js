import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import {
    listMachinesController,
    getMachineController,
} from '../controllers/machineController.js';
import {
    createSnapshotController,
    listSnapshotsController,
} from '../controllers/machineSnapshotController.js';

const router = Router();

// LISTAR máquinas
router.get('/', authRequired, listMachinesController);

// DETALHE de uma máquina
router.get('/:id', authRequired, getMachineController);

// SNAPSHOTS de produção
router.post('/:id/production-snapshots', authRequired, createSnapshotController);
router.get('/:id/production-snapshots', authRequired, listSnapshotsController);

export default router;
