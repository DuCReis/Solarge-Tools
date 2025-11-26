// backend/src/controllers/layupEventController.js
import db from '../models/index.js';
import {
    createLayupEvent,
    listLayupEvents,
    getLayupEventById,
} from '../services/layupEventService.js';

const ALLOWED_TYPES = [
    'STRING_DIVERTED',
    'STRING_PLACED',
    'FAULT',
    'RECOVERY',
    'OTHER',
];

const ALLOWED_SOURCE = ['MACHINE', 'OPERATOR'];
const ALLOWED_LANE = ['A', 'B', 'C', 'LEFT', 'RIGHT'];

// POST /api/layup-events
export async function createLayupEventController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            snapshotId,
            eventDatetime,
            type,
            lane,
            positionIndex,
            isGoodString,
            source,
            reason,
            notes,
        } = req.body;

        if (!machineId) {
            return res.status(400).json({ message: 'machineId é obrigatório.' });
        }

        if (!type) {
            return res.status(400).json({ message: 'type é obrigatório.' });
        }

        if (!ALLOWED_TYPES.includes(type)) {
            return res.status(400).json({
                message: `type inválido. Permitidos: ${ALLOWED_TYPES.join(', ')}`,
            });
        }

        if (source && !ALLOWED_SOURCE.includes(source)) {
            return res.status(400).json({
                message: `source inválido. Permitidos: ${ALLOWED_SOURCE.join(', ')}`,
            });
        }

        let laneValue = lane || null;
        if (laneValue && !ALLOWED_LANE.includes(laneValue)) {
            return res.status(400).json({
                message: `lane inválido. Exemplos válidos: ${ALLOWED_LANE.join(', ')}`,
            });
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

        const dt = eventDatetime ? new Date(eventDatetime) : new Date();
        if (Number.isNaN(dt.getTime())) {
            return res.status(400).json({ message: 'eventDatetime inválido.' });
        }

        let posIndex = null;
        if (positionIndex !== undefined && positionIndex !== null && positionIndex !== '') {
            const n = Number(positionIndex);
            if (Number.isNaN(n) || n < 0) {
                return res.status(400).json({
                    message: 'positionIndex deve ser um número >= 0.',
                });
            }
            posIndex = n;
        }

        const payload = {
            machineId,
            operatorId,
            snapshotId: validSnapshotId,
            eventDatetime: dt,
            type,
            lane: laneValue,
            positionIndex: posIndex,
            isGoodString: typeof isGoodString === 'boolean' ? isGoodString : null,
            source: source || null,
            reason: reason || null,
            notes: notes || null,
        };

        const record = await createLayupEvent(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating layup event' });
    }
}

// GET /api/layup-events
export async function listLayupEventsController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            type: req.query.type,
            lane: req.query.lane,
            source: req.query.source,
            from: req.query.from,
            to: req.query.to,
        };

        if (req.query.isGoodString === 'true') {
            filters.isGoodString = true;
        } else if (req.query.isGoodString === 'false') {
            filters.isGoodString = false;
        }

        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
        const offset = (page - 1) * limit;

        const list = await listLayupEvents(filters, { limit, offset });

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error loading layup events' });
    }
}

// GET /api/layup-events/:id
export async function getLayupEventController(req, res) {
    try {
        const { id } = req.params;

        const record = await getLayupEventById(id);
        if (!record) {
            return res.status(404).json({ message: 'Layup event não encontrado.' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error loading layup event' });
    }
}
