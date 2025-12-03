// backend/src/services/machineProductionSnapshotService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export async function createMachineProductionSnapshot(payload) {
    return db.MachineProductionSnapshot.create({
        machine_id: payload.machineId,
        operator_id: payload.operatorId || null,
        snapshot_datetime: payload.snapshotDatetime,
        shift: payload.shift || null,

        total_strings: payload.totalStrings ?? 0,
        good_strings: payload.goodStrings ?? 0,

        rejected_mc: payload.rejectedMc ?? 0,
        rejected_ups: payload.rejectedUps ?? 0,
        rejected_rm: payload.rejectedRm ?? 0,
        rejected_bc: payload.rejectedBc ?? 0,
        rejected_other: payload.rejectedOther ?? 0,

        good_rejected: payload.goodRejected ?? 0,

        comments: payload.comments || null,
    });
}

export async function listMachineProductionSnapshots(filters = {}, pagination = {}) {
    const where = {};

    if (filters.machineId) {
        where.machine_id = filters.machineId;
    }

    if (filters.shift) {
        where.shift = filters.shift;
    }

    if (filters.from || filters.to) {
        where.snapshot_datetime = {};
        if (filters.from) {
            where.snapshot_datetime[Op.gte] = new Date(filters.from);
        }
        if (filters.to) {
            where.snapshot_datetime[Op.lte] = new Date(filters.to);
        }
    }

    const { limit, offset } = pagination || {};

    const options = {
        where,
        include: [
            { model: db.Machine, as: 'machine', attributes: ['id', 'name', 'code'] },
            { model: db.User, as: 'operator', attributes: ['id', 'name'] },
        ],
        order: [['snapshot_datetime', 'DESC']],
    };

    if (typeof limit === 'number') options.limit = limit;
    if (typeof offset === 'number') options.offset = offset;

    return db.MachineProductionSnapshot.findAll(options);
}

export async function getMachineProductionSnapshotById(id) {
    return db.MachineProductionSnapshot.findByPk(id, {
        include: [
            { model: db.Machine, as: 'machine', attributes: ['id', 'name', 'code'] },
            { model: db.User, as: 'operator', attributes: ['id', 'name'] },
            {
                model: db.StringRejection,
                as: 'StringRejections',
                attributes: [
                    'id',
                    'category',
                    'source',
                    'is_good_string',
                    'side',
                    'mc_x',
                    'mc_y',
                    'notes',
                    'created_at',
                ],
            },
        ],
    });
}
