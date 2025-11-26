// backend/src/services/layupEventService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export async function createLayupEvent(payload) {
    return db.LayupEvent.create({
        machine_id: payload.machineId,
        operator_id: payload.operatorId || null,
        snapshot_id: payload.snapshotId || null,
        event_datetime: payload.eventDatetime,
        type: payload.type,
        lane: payload.lane || null,
        position_index: payload.positionIndex ?? null,
        is_good_string: payload.isGoodString ?? null,
        source: payload.source || null,
        reason: payload.reason || null,
        notes: payload.notes || null,
    });
}

export async function listLayupEvents(filters = {}, pagination = {}) {
    const where = {};

    if (filters.machineId) {
        where.machine_id = filters.machineId;
    }

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.lane) {
        where.lane = filters.lane;
    }

    if (typeof filters.isGoodString === 'boolean') {
        where.is_good_string = filters.isGoodString;
    }

    if (filters.source) {
        where.source = filters.source;
    }

    if (filters.from || filters.to) {
        where.event_datetime = {};
        if (filters.from) {
            where.event_datetime[Op.gte] = new Date(filters.from);
        }
        if (filters.to) {
            where.event_datetime[Op.lte] = new Date(filters.to);
        }
    }

    const { limit, offset } = pagination || {};

    const options = {
        where,
        include: [
            { model: db.Machine, as: 'Machine', attributes: ['id', 'name', 'code'] },
            { model: db.User, as: 'Operator', attributes: ['id', 'name'] },
            {
                model: db.MachineProductionSnapshot,
                as: 'Snapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
        ],
        order: [['event_datetime', 'DESC'], ['id', 'DESC']],
    };

    if (typeof limit === 'number') options.limit = limit;
    if (typeof offset === 'number') options.offset = offset;

    return db.LayupEvent.findAll(options);
}

export async function getLayupEventById(id) {
    return db.LayupEvent.findByPk(id, {
        include: [
            { model: db.Machine, as: 'Machine', attributes: ['id', 'name', 'code'] },
            { model: db.User, as: 'Operator', attributes: ['id', 'name'] },
            {
                model: db.MachineProductionSnapshot,
                as: 'Snapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
        ],
    });
}
