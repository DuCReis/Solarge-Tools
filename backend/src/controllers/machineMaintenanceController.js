// backend/src/controllers/machineMaintenanceController.js
import db from '../models/index.js';
import {
    createMaintenanceLog,
    updateMaintenanceLogStatus,
    listMaintenanceLogs,
    getMaintenanceLogById,
} from '../services/machineMaintenanceService.js';

const ALLOWED_STATUS = ['OPEN', 'IN_PROGRESS', 'DONE'];
const ALLOWED_TYPE = ['PLANNED', 'UNPLANNED', 'BREAKDOWN', 'INSPECTION', 'CLEANING', 'OTHER'];
const ALLOWED_SEVERITY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

// POST /api/maintenance
export async function createMaintenanceLogController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            snapshotId,
            startDatetime,
            endDatetime,
            type,
            category,
            severity,
            status,
            description,
            rootCause,
            correctiveAction,
            notes,
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

        // snapshot opcional
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

        let st = status || 'OPEN';
        if (!ALLOWED_STATUS.includes(st)) {
            return res.status(400).json({
                message: `status inválido. Permitidos: ${ALLOWED_STATUS.join(', ')}`,
            });
        }

        let t = type || null;
        if (t && !ALLOWED_TYPE.includes(t)) {
            return res.status(400).json({
                message: `type inválido. Permitidos: ${ALLOWED_TYPE.join(', ')}`,
            });
        }

        let sev = severity || null;
        if (sev && !ALLOWED_SEVERITY.includes(sev)) {
            return res.status(400).json({
                message: `severity inválido. Permitidos: ${ALLOWED_SEVERITY.join(', ')}`,
            });
        }

        let durationMinutes = null;
        if (startDt && endDt) {
            const diffMs = endDt.getTime() - startDt.getTime();
            if (diffMs >= 0) {
                durationMinutes = Math.round(diffMs / 60000);
            }
        }

        const payload = {
            machineId,
            operatorId,
            snapshotId: validSnapshotId,
            startDatetime: startDt,
            endDatetime: endDt,
            durationMinutes,
            type: t,
            category: category || null,
            severity: sev,
            status: st,
            description: description || null,
            rootCause: rootCause || null,
            correctiveAction: correctiveAction || null,
            notes: notes || null,
        };

        const record = await createMaintenanceLog(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error creating maintenance log' });
    }
}

// PATCH /api/maintenance/:id/status
export async function updateMaintenanceLogStatusController(req, res) {
    try {
        const { id } = req.params;
        const {
            status,
            endDatetime,
            durationMinutes,
            rootCause,
            correctiveAction,
            notes,
        } = req.body;

        if (status && !ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({
                message: `status inválido. Permitidos: ${ALLOWED_STATUS.join(', ')}`,
            });
        }

        let endDt = null;
        if (endDatetime) {
            endDt = new Date(endDatetime);
            if (Number.isNaN(endDt.getTime())) {
                return res.status(400).json({ message: 'endDatetime inválido.' });
            }
        }

        const payload = {
            status,
            endDatetime: endDt,
            durationMinutes: durationMinutes ?? undefined,
            rootCause,
            correctiveAction,
            notes,
        };

        const record = await updateMaintenanceLogStatus(id, payload);
        if (!record) {
            return res.status(404).json({ message: 'Maintenance log não encontrado.' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error updating maintenance log' });
    }
}

// GET /api/maintenance
export async function listMaintenanceLogsController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            status: req.query.status,
            type: req.query.type,
            category: req.query.category,
            severity: req.query.severity,
            from: req.query.from,
            to: req.query.to,
        };

        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
        const offset = (page - 1) * limit;

        const list = await listMaintenanceLogs(filters, { limit, offset });

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading maintenance logs' });
    }
}

// GET /api/maintenance/:id
export async function getMaintenanceLogController(req, res) {
    try {
        const { id } = req.params;

        const record = await getMaintenanceLogById(id);
        if (!record) {
            return res.status(404).json({ message: 'Maintenance log não encontrado.' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading maintenance log' });
    }
}
