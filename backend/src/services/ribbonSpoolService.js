// backend/src/services/ribbonSpoolService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export async function createRibbonSpool(payload) {
    return db.RibbonSpool.create({
        machine_id: payload.machineId,
        side: payload.side || null,
        batch_code: payload.batchCode,
        supplier: payload.supplier || null,
        material: payload.material || null,
        width_mm: payload.widthMm ?? null,
        thickness_mm: payload.thicknessMm ?? null,
        weight_start_g: payload.weightStartG ?? null,
        weight_end_g: payload.weightEndG ?? null,
        weight_current_g: payload.weightCurrentG ?? null,
        estimated_consumption_per_string: payload.estimatedConsumptionPerString ?? null,
        status: payload.status || 'ACTIVE',
        start_datetime: payload.startDatetime,
        end_datetime: payload.endDatetime || null,
        start_snapshot_id: payload.startSnapshotId || null,
        end_snapshot_id: payload.endSnapshotId || null,
        notes: payload.notes || null,
    });
}

export async function updateRibbonSpool(id, payload) {
    const spool = await db.RibbonSpool.findByPk(id);
    if (!spool) return null;

    if (payload.status) spool.status = payload.status;
    if (payload.endDatetime !== undefined) spool.end_datetime = payload.endDatetime;
    if (payload.weightEndG !== undefined) spool.weight_end_g = payload.weightEndG;
    if (payload.weightCurrentG !== undefined) spool.weight_current_g = payload.weightCurrentG;
    if (payload.endSnapshotId !== undefined) spool.end_snapshot_id = payload.endSnapshotId;
    if (payload.notes !== undefined) spool.notes = payload.notes;

    await spool.save();
    return spool;
}

export async function listRibbonSpools(filters = {}, pagination = {}) {
    const where = {};

    if (filters.machineId) {
        where.machine_id = filters.machineId;
    }

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.side) {
        where.side = filters.side;
    }

    if (filters.batchCode) {
        where.batch_code = { [Op.like]: `%${filters.batchCode}%` };
    }

    if (filters.from || filters.to) {
        where.start_datetime = {};
        if (filters.from) {
            where.start_datetime[Op.gte] = new Date(filters.from);
        }
        if (filters.to) {
            where.start_datetime[Op.lte] = new Date(filters.to);
        }
    }

    const { limit, offset } = pagination || {};

    const options = {
        where,
        include: [
            { model: db.Machine, as: 'Machine', attributes: ['id', 'name', 'code'] },
            {
                model: db.MachineProductionSnapshot,
                as: 'StartSnapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
            {
                model: db.MachineProductionSnapshot,
                as: 'EndSnapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
        ],
        order: [['start_datetime', 'DESC'], ['id', 'DESC']],
    };

    if (typeof limit === 'number') options.limit = limit;
    if (typeof offset === 'number') options.offset = offset;

    return db.RibbonSpool.findAll(options);
}

export async function getRibbonSpoolById(id) {
    return db.RibbonSpool.findByPk(id, {
        include: [
            { model: db.Machine, as: 'Machine', attributes: ['id', 'name', 'code'] },
            {
                model: db.MachineProductionSnapshot,
                as: 'StartSnapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
            {
                model: db.MachineProductionSnapshot,
                as: 'EndSnapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
        ],
    });
}
