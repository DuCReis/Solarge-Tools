// backend/src/routes/machineRecipeChangeRoutes.js
import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
    createMachineRecipeChangeController,
    listMachineRecipeChangesController,
    getMachineRecipeChangeController,
} from '../controllers/machineRecipeChangeController.js';

const router = Router();

// Listar (qualquer utilizador autenticado)
router.get(
    '/',
    authRequired,
    listMachineRecipeChangesController
);

// Detalhe por ID
router.get(
    '/:id',
    authRequired,
    getMachineRecipeChangeController
);

// Criar alteração de receita (apenas roles específicos)
router.post(
    '/',
    authRequired,
    requireRole('admin', 'engineer', 'qc'), // ajusta conforme quiseres
    createMachineRecipeChangeController
);

export default router;
