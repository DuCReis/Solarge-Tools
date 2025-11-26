// backend/src/controllers/ribbonSpoolController.js
import db from '../models/index.js';
import {
    createRibbonSpool,
    updateRibbonSpool,
    listRibbonSpools,
    getRibbonSpoolById,
} from '../services/ribbonSpoolService.js';

const ALLOWED_STATUS = ['ACTIVE', 'FINISHED', 'PLANNED'];
const ALLOWED_SIDE = ['LEFT', 'RIGHT', 'BOTH'];

// helper para converter para número ou null
function numOrNull(v) {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(v);
    if (Number.isNaN(n)) return null;
    return n;
}

// POST /api/ribbon-spools
export async function createRibbonSpoolController(req, res) {
    try {
        const {
            machineId,
            side,
            batchCode,
            supplier,
            material,
            widthMm,
            thicknessMm,
            weightStartG,
            weightEndG,
            weightCurrentG,
            estimatedConsumptionPerString,
            status,
            startDatetime,
            endDatetime,
            startSnapshotId,
            endSnapshotId,
            notes,
        } = req.body;

        if (!machineId) {
            return res.status(400).json({ message: 'machineId é obrigatório.' });
        }

        if (!batchCode) {
            return res.status(400).json({ message: 'batchCode é obrigatório.' });
        }

        // validar máquina
        const machine = await db.Machine.findByPk(machineId);
        if (!machine) {
            return res.status(400).json({
                message: `Máquina com id ${machineId} não existe.`,
            });
        }

        let sideValue = side || null;
        if (sideValue && !ALLOWED_SIDE.includes(sideValue)) {
            return res.status(400).json({
                message: `side inválido. Permitidos: ${ALLOWED_SIDE.join(', ')}`,
            });
        }

        let statusValue = status || 'ACTIVE';
        if (!ALLOWED_STATUS.includes(statusValue)) {
            return res.status(400).json({
                message: `status inválido. Permitidos: ${ALLOWED_STATUS.join(', ')}`,
            });
        }

        const startDt = startDatetime ? new Date(startDatetime) : new Date();
        if (Number.isNaN(startDt.getTime())) {
            return res.status(400).json({ message: 'startDatetime inválido.' });
        }

        let endDt = null;
        if (endDatetime) {
            endDt = new Date(endDatetime);
            if (Number.isNaN(endDt.getTime())) {
                return res.status(400).json({ message: 'endDatetime inválido.' });
            }
        }

        // validar snapshots se forem enviados (opcional)
        let validStartSnapshotId = null;
        if (startSnapshotId) {
            const snap = await db.MachineProductionSnapshot.findByPk(startSnapshotId);
            if (!snap) {
                return res.status(400).json({
                    message: `Start snapshot com id ${startSnapshotId} não existe.`,
                    field: 'startSnapshotId',
                });
            }
            validStartSnapshotId = snap.id;
        }

        let validEndSnapshotId = null;
        if (endSnapshotId) {
            const snap = await db.MachineProductionSnapshot.findByPk(endSnapshotId);
            if (!snap) {
                return res.status(400).json({
                    message: `End snapshot com id ${endSnapshotId} não existe.`,
                    field: 'endSnapshotId',
                });
            }
            validEndSnapshotId = snap.id;
        }

        const payload = {
            machineId,
            side: sideValue,
            batchCode,
            supplier,
            material,
            widthMm: numOrNull(widthMm),
            thicknessMm: numOrNull(thicknessMm),
            weightStartG: numOrNull(weightStartG),
            weightEndG: numOrNull(weightEndG),
            weightCurrentG: numOrNull(weightCurrentG),
            estimatedConsumptionPerString: numOrNull(estimatedConsumptionPerString),
            status: statusValue,
            startDatetime: startDt,
            endDatetime: endDt,
            startSnapshotId: validStartSnapshotId,
            endSnapshotId: validEndSnapshotId,
            notes: notes || null,
        };

        const record = await createRibbonSpool(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating ribbon spool' });
    }
}

// PATCH /api/ribbon-spools/:id
export async function updateRibbonSpoolController(req, res) {
    try {
        const { id } = req.params;
        const {
            status,
            endDatetime,
            weightEndG,
            weightCurrentG,
            endSnapshotId,
            notes,
        } = req.body;

        const updatePayload = {};

        if (status) {
            if (!ALLOWED_STATUS.includes(status)) {
                return res.status(400).json({
                    message: `status inválido. Permitidos: ${ALLOWED_STATUS.join(', ')}`,
                });
            }
            updatePayload.status = status;
        }

        if (endDatetime) {
            const endDt = new Date(endDatetime);
            if (Number.isNaN(endDt.getTime())) {
                return res.status(400).json({ message: 'endDatetime inválido.' });
            }
            updatePayload.endDatetime = endDt;
        }

        if (weightEndG !== undefined) {
            updatePayload.weightEndG = numOrNull(weightEndG);
        }

        if (weightCurrentG !== undefined) {
            updatePayload.weightCurrentG = numOrNull(weightCurrentG);
        }

        if (endSnapshotId) {
            const snap = await db.MachineProductionSnapshot.findByPk(endSnapshotId);
            if (!snap) {
                return res.status(400).json({
                    message: `End snapshot com id ${endSnapshotId} não existe.`,
                    field: 'endSnapshotId',
                });
            }
            updatePayload.endSnapshotId = snap.id;
        }

        if (notes !== undefined) {
            updatePayload.notes = notes;
        }

        const record = await updateRibbonSpool(id, updatePayload);
        if (!record) {
            return res.status(404).json({ message: 'Ribbon spool não encontrado.' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating ribbon spool' });
    }
}

// GET /api/ribbon-spools
export async function listRibbonSpoolsController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            status: req.query.status,
            side: req.query.side,
            batchCode: req.query.batchCode,
            from: req.query.from,
            to: req.query.to,
        };

        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
        const offset = (page - 1) * limit;

        const list = await listRibbonSpools(filters, { limit, offset });

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error loading ribbon spools' });
    }
}

// GET /api/ribbon-spools/:id
export async function getRibbonSpoolController(req, res) {
    try {
        const { id } = req.params;

        const record = await getRibbonSpoolById(id);
        if (!record) {
            return res.status(404).json({ message: 'Ribbon spool não encontrado.' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error loading ribbon spool' });
    }
}
