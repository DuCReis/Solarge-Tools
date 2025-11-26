// backend/src/services/peelForceService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

// Criação de um registo de Peel Force
export async function createPeelForceMeasurement(payload) {
    return db.PeelForceMeasurement.create({
        machine_id: payload.machineId,
        operator_id: payload.operatorId,
        value_n: payload.valueN,
        ribbon_type: payload.ribbonType || null,
        ribbon_batch: payload.ribbonBatch || null,
        flux_type: payload.fluxType || null,
        cell_type: payload.cellType || null,
        zone: payload.zone || null,
        operator_notes: payload.operatorNotes || null,
        measurement_datetime: payload.measurementDatetime,
    });
}

// Listagem de Peel Force com filtros opcionais
export async function listPeelForceMeasurements({ machineId, from, to } = {}) {
    const where = {};

    if (machineId) {
        where.machine_id = machineId;
    }

    if (from || to) {
        where.measurement_datetime = {};
        if (from) {
            where.measurement_datetime[Op.gte] = new Date(from);
        }
        if (to) {
            where.measurement_datetime[Op.lte] = new Date(to);
        }
    }

    return db.PeelForceMeasurement.findAll({
        where,
        include: [
            { model: db.Machine, attributes: ['id', 'name', 'code'] },
            { model: db.User, attributes: ['id', 'name'] },
        ],
        order: [['measurement_datetime', 'DESC']],
    });
}
