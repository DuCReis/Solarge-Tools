// backend/src/services/stringRejectionService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

// Criação de um registo de string rejection
export async function createStringRejection(payload) {
    return db.StringRejection.create({
        machine_id: payload.machineId,
        operator_id: payload.operatorId,
        snapshot_id: payload.snapshotId || null,
        source: payload.source,
        category: payload.category,
        is_good_string: payload.isGoodString ?? false,
        side: payload.side || null,
        mc_x: payload.mcX,
        mc_y: payload.mcY,
        notes: payload.notes || null,
    });
}

// Listagem de string rejections com filtros + paginação opcional
export async function listStringRejections(filters = {}, pagination = {}) {
    const where = {};

    // filtros
    if (filters.machineId) {
        where.machine_id = filters.machineId;
    }

    if (typeof filters.isGoodString === 'boolean') {
        where.is_good_string = filters.isGoodString;
    }

    if (filters.source) {
        where.source = filters.source;
    }

    if (filters.category) {
        where.category = filters.category;
    }

    // filtro por intervalo de datas (created_at)
    if (filters.from || filters.to) {
        where.created_at = {};
        if (filters.from) {
            where.created_at[Op.gte] = new Date(filters.from);
        }
        if (filters.to) {
            where.created_at[Op.lte] = new Date(filters.to);
        }
    }

    // paginação (já vem calculada no controller)
    const { limit, offset } = pagination || {};

    const options = {
        where,
        include: [
            { model: db.Machine, attributes: ['id', 'name', 'code'] },
            { model: db.User, attributes: ['id', 'name'] },
            {
                model: db.MachineProductionSnapshot,
                attributes: ['id', 'snapshot_datetime'],
            },
        ],
        order: [['created_at', 'DESC']],
    };

    if (typeof limit === 'number') {
        options.limit = limit;
    }
    if (typeof offset === 'number') {
        options.offset = offset;
    }

    return db.StringRejection.findAll(options);
}
