import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import {
    createPeelForceController,
    listPeelForceController,
    getPeelForceByIdController,
} from '../controllers/peelForceController.js';

const router = Router();

router.post('/', authRequired, createPeelForceController);
router.get('/', authRequired, listPeelForceController);
router.get('/:id', authRequired, getPeelForceByIdController);

export default router;
