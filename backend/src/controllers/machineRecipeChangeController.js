// backend/src/controllers/machineRecipeChangeController.js
import db from '../models/index.js';
import {
    createMachineRecipeChange,
    listMachineRecipeChanges,
    getMachineRecipeChangeById,
} from '../services/machineRecipeChangeService.js';

const ALLOWED_PARAMETER_GROUPS = [
    'TEMPERATURE',
    'VACUUM',
    'SPEED',
    'FLUX',
    'PRESSURE',
    'PROFILE',
    'OTHER',
];

// POST /api/recipe-changes
export async function createMachineRecipeChangeController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            snapshotId,
            changeDatetime,
            parameterGroup,
            parameterName,
            oldValue,
            newValue,
            unit,
            reason,
            notes,
        } = req.body;

        if (!machineId) {
            return res.status(400).json({ message: 'machineId é obrigatório.' });
        }

        if (!parameterName) {
            return res.status(400).json({ message: 'parameterName é obrigatório.' });
        }

        if (!newValue && newValue !== 0) {
            return res.status(400).json({ message: 'newValue é obrigatório.' });
        }

        // validar máquina existe
        const machine = await db.Machine.findByPk(machineId);
        if (!machine) {
            return res.status(400).json({
                message: `Máquina com id ${machineId} não existe.`,
            });
        }

        // validar snapshot (se vier)
        let validSnapshotId = null;
        if (snapshotId) {
            const snap = await db.MachineProductionSnapshot.findByPk(snapshotId);
            if (!snap) {
                return res.status(400).json({
                    message: `Snapshot com id ${snapshotId} não existe.`,
                    field: 'snapshotId',
                });
            }
            validSnapshotId = snap.id;
        }

        // validar grupo de parâmetro (se vier)
        let group = parameterGroup || null;
        if (group && !ALLOWED_PARAMETER_GROUPS.includes(group)) {
            return res.status(400).json({
                message: `parameterGroup inválido. Permitidos: ${ALLOWED_PARAMETER_GROUPS.join(', ')}.`,
            });
        }

        const dt = changeDatetime ? new Date(changeDatetime) : new Date();
        if (Number.isNaN(dt.getTime())) {
            return res.status(400).json({
                message: 'changeDatetime inválido.',
            });
        }

        const payload = {
            machineId,
            operatorId,
            snapshotId: validSnapshotId,
            changeDatetime: dt,
            parameterGroup: group,
            parameterName,
            oldValue: oldValue ?? null,
            newValue: String(newValue),
            unit: unit || null,
            reason: reason || null,
            notes: notes || null,
        };

        const record = await createMachineRecipeChange(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error creating machine recipe change' });
    }
}

// GET /api/recipe-changes
export async function listMachineRecipeChangesController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            snapshotId: req.query.snapshotId,
            parameterGroup: req.query.parameterGroup,
            parameterName: req.query.parameterName,
            from: req.query.from,
            to: req.query.to,
        };

        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
        const offset = (page - 1) * limit;

        const list = await listMachineRecipeChanges(filters, { limit, offset });

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading machine recipe changes' });
    }
}

// GET /api/recipe-changes/:id
export async function getMachineRecipeChangeController(req, res) {
    try {
        const { id } = req.params;

        const record = await getMachineRecipeChangeById(id);
        if (!record) {
            return res.status(404).json({ message: 'Recipe change não encontrado.' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading machine recipe change' });
    }
}
