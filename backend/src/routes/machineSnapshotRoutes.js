import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import {
    createSnapshotController,
    listSnapshotsController
} from '../controllers/machineSnapshotController.js';

const router = Router();

router.post('/:id/production-snapshots', authRequired, createSnapshotController);
router.get('/:id/production-snapshots', authRequired, listSnapshotsController);

export default router;
