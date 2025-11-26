// backend/src/controllers/peelForceController.js
import db from '../models/index.js';
import {
    createPeelForceMeasurement,
    listPeelForceMeasurements,
} from '../services/peelForceService.js';

// ajusta estes arrays para os valores reais que vocês usam
const ALLOWED_ZONE = ['TOP', 'MIDDLE', 'BOTTOM'];     // exemplo
const ALLOWED_CELL_TYPE = ['PERC', 'TOPCON'];         // exemplo

// POST /api/peel-force
export async function createPeelForceController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            valueN,
            ribbonType,
            ribbonBatch,
            fluxType,
            cellType,
            zone,
            operatorNotes,
            measurementDatetime,
        } = req.body;

        // validações básicas
        if (!machineId) {
            return res.status(400).json({ message: 'machineId é obrigatório.' });
        }

        if (valueN == null) {
            return res.status(400).json({ message: 'valueN (força em N) é obrigatório.' });
        }

        const v = parseFloat(valueN);
        if (Number.isNaN(v) || v <= 0 || v > 20) {
            return res.status(400).json({
                message: 'valueN deve ser um número > 0 e razoável (ex: < 20 N).',
            });
        }

        if (zone && !ALLOWED_ZONE.includes(zone)) {
            return res.status(400).json({
                message: `zone inválido. Permitidos: ${ALLOWED_ZONE.join(', ')}.`,
            });
        }

        if (cellType && !ALLOWED_CELL_TYPE.includes(cellType)) {
            return res.status(400).json({
                message: `cellType inválido. Ex: ${ALLOWED_CELL_TYPE.join(', ')}`,
            });
        }

        // validar que a máquina existe
        const machine = await db.Machine.findByPk(machineId);
        if (!machine) {
            return res.status(400).json({
                message: `Máquina com id ${machineId} não existe.`,
            });
        }

        const dt = measurementDatetime ? new Date(measurementDatetime) : new Date();
        if (Number.isNaN(dt.getTime())) {
            return res.status(400).json({
                message: 'measurementDatetime inválido.',
            });
        }

        const payload = {
            machineId,
            operatorId,
            valueN: v,
            ribbonType,
            ribbonBatch,
            fluxType,
            cellType,
            zone,
            operatorNotes,
            measurementDatetime: dt,
        };

        const record = await createPeelForceMeasurement(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating peel force measurement' });
    }
}

// GET /api/peel-force
export async function listPeelForceController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            from: req.query.from,
            to: req.query.to,
        };

        const list = await listPeelForceMeasurements(filters);

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error loading peel force data' });
    }
}
