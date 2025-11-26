import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import {
    createPeelForceController,
    listPeelForceController
} from '../controllers/peelForceController.js';

const router = Router();

router.post('/', authRequired, createPeelForceController);
router.get('/', authRequired, listPeelForceController);

export default router;
