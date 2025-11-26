// backend/src/controllers/machineProductionSnapshotController.js
import db from '../models/index.js';
import {
    createMachineProductionSnapshot,
    listMachineProductionSnapshots,
    getMachineProductionSnapshotById,
} from '../services/machineProductionSnapshotService.js';

// POST /api/snapshots
export async function createMachineProductionSnapshotController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            snapshotDatetime,
            shift,
            totalStrings,
            goodStrings,
            rejectedMc,
            rejectedUps,
            rejectedRm,
            rejectedBc,
            rejectedOther,
            goodRejected,
            comments,
        } = req.body;

        if (!machineId) {
            return res.status(400).json({ message: 'machineId é obrigatório.' });
        }

        // validar máquina
        const machine = await db.Machine.findByPk(machineId);
        if (!machine) {
            return res.status(400).json({
                message: `Máquina com id ${machineId} não existe.`,
            });
        }

        const dt = snapshotDatetime ? new Date(snapshotDatetime) : new Date();
        if (Number.isNaN(dt.getTime())) {
            return res.status(400).json({
                message: 'snapshotDatetime inválido.',
            });
        }

        const numericOrNull = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

        const payload = {
            machineId,
            operatorId,
            snapshotDatetime: dt,
            shift: shift || null,

            totalStrings: numericOrNull(totalStrings) ?? 0,
            goodStrings: numericOrNull(goodStrings) ?? 0,
            rejectedMc: numericOrNull(rejectedMc) ?? 0,
            rejectedUps: numericOrNull(rejectedUps) ?? 0,
            rejectedRm: numericOrNull(rejectedRm) ?? 0,
            rejectedBc: numericOrNull(rejectedBc) ?? 0,
            rejectedOther: numericOrNull(rejectedOther) ?? 0,
            goodRejected: numericOrNull(goodRejected) ?? 0,

            comments: comments || null,
        };

        // (opcional) pequena sanidade: não deixar counts negativos
        const counts = [
            payload.totalStrings,
            payload.goodStrings,
            payload.rejectedMc,
            payload.rejectedUps,
            payload.rejectedRm,
            payload.rejectedBc,
            payload.rejectedOther,
            payload.goodRejected,
        ];

        if (counts.some((v) => v < 0)) {
            return res.status(400).json({
                message: 'Valores de contagem não podem ser negativos.',
            });
        }

        const record = await createMachineProductionSnapshot(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error creating machine production snapshot' });
    }
}

// GET /api/snapshots
export async function listMachineProductionSnapshotsController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            shift: req.query.shift,
            from: req.query.from,
            to: req.query.to,
        };

        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
        const offset = (page - 1) * limit;

        const list = await listMachineProductionSnapshots(filters, { limit, offset });

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading machine production snapshots' });
    }
}

// GET /api/snapshots/:id
export async function getMachineProductionSnapshotController(req, res) {
    try {
        const { id } = req.params;

        const snapshot = await getMachineProductionSnapshotById(id);
        if (!snapshot) {
            return res.status(404).json({ message: 'Snapshot não encontrada.' });
        }

        return res.json(snapshot);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading machine production snapshot' });
    }
}
