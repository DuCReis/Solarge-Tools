// backend/src/controllers/peelForceController.js
import db from '../models/index.js';
import { Op } from 'sequelize';

// POST /api/peel-force
export async function createPeelForceController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            ribbonType,
            ribbonBatch,
            fluxType,
            cellType,
            operatorNotes,
            measurementDatetime,
            warehouseTemperature,
            machineTemperature,
            machineVacuum,
            measurements, // grid completo enviado pelo frontend
        } = req.body;

        if (!machineId) {
            return res.status(400).json({ message: 'machineId is required.' });
        }

        // validar máquina
        const machine = await db.Machine.findByPk(machineId);
        if (!machine) {
            return res
                .status(400)
                .json({ message: `Machine with id ${machineId} does not exist.` });
        }

        const dt = measurementDatetime ? new Date(measurementDatetime) : new Date();
        if (Number.isNaN(dt.getTime())) {
            return res
                .status(400)
                .json({ message: 'measurementDatetime is invalid.' });
        }

        // measurements deve ter formato:
        // {
        //   front: { "1": [14], "5": [14], "10": [14] },
        //   back:  { "1": [14], "5": [14], "10": [14] }
        // }
        if (!measurements || typeof measurements !== 'object') {
            return res
                .status(400)
                .json({ message: 'measurements (grid data) is required.' });
        }

        const values = [];

        ['front', 'back'].forEach((side) => {
            const sideObj = measurements[side];
            if (!sideObj) return;
            ['1', '5', '10'].forEach((r) => {
                const arr = sideObj[r];
                if (!Array.isArray(arr)) return;
                arr.forEach((v) => {
                    const num = parseFloat(v);
                    if (!Number.isNaN(num)) {
                        values.push(num);
                    }
                });
            });
        });

        if (!values.length) {
            return res.status(400).json({
                message: 'At least one peel force value is required in the grid.',
            });
        }

        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length; // média global

        const created = await db.PeelForceMeasurement.create({
            machine_id: machineId,
            operator_id: operatorId,
            value_n: avg,
            ribbon_type: ribbonType,
            ribbon_batch: ribbonBatch,
            flux_type: fluxType,
            cell_type: cellType,
            operator_notes: operatorNotes,
            measurement_datetime: dt,
            warehouse_temperature: warehouseTemperature,
            machine_temperature: machineTemperature,
            machine_vacuum: machineVacuum,
            grid_data: measurements,
        });

        const record = await db.PeelForceMeasurement.findByPk(created.id, {
            include: [
                { model: db.Machine },
                { model: db.User, attributes: ['id', 'name'] },
            ],
        });

        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error creating peel force measurement' });
    }
}

// GET /api/peel-force
export async function listPeelForceController(req, res) {
    try {
        const { machineId, from, to } = req.query;

        const where = {};

        // 1) Filtro por máquina (SQL)
        if (machineId) {
            where.machine_id = machineId;
        }

        // 2) Filtro por datas (SQL) – tenta reduzir logo na query
        const dateWhere = {};

        if (from) {
            const start = new Date(from);
            start.setHours(0, 0, 0, 0);
            dateWhere[Op.gte] = start;
        }

        if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            dateWhere[Op.lte] = end;
        }

        if (Object.keys(dateWhere).length > 0) {
            where.measurement_datetime = dateWhere;
        }

        // 3) Buscar da DB com estes filtros
        let list = await db.PeelForceMeasurement.findAll({
            where,
            include: [
                { model: db.Machine },
                { model: db.User, attributes: ['id', 'name'] },
            ],
            order: [['measurement_datetime', 'DESC']],
        });

        // 4) Filtro extra em JavaScript (seguro de vida)
        if (from) {
            const fromDate = new Date(from);
            fromDate.setHours(0, 0, 0, 0);

            list = list.filter((rec) => {
                const raw = rec.measurement_datetime || rec.measurementDatetime;
                const d = raw ? new Date(raw) : null;
                if (!d || Number.isNaN(d.getTime())) return false;
                return d >= fromDate;
            });
        }

        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);

            list = list.filter((rec) => {
                const raw = rec.measurement_datetime || rec.measurementDatetime;
                const d = raw ? new Date(raw) : null;
                if (!d || Number.isNaN(d.getTime())) return false;
                return d <= toDate;
            });
        }

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading peel force data' });
    }
}



// GET /api/peel-force/:id
export async function getPeelForceByIdController(req, res) {
    try {
        const { id } = req.params;

        const record = await db.PeelForceMeasurement.findByPk(id, {
            include: [
                { model: db.Machine },
                { model: db.User, attributes: ['id', 'name'] },
            ],
        });

        if (!record) {
            return res.status(404).json({ message: 'Peel force test not found' });
        }

        return res.json(record);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Error loading peel force test' });
    }
}
