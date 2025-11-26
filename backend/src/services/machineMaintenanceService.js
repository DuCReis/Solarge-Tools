// backend/src/services/machineMaintenanceService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export async function createMaintenanceLog(payload) {
    return db.MachineMaintenanceLog.create({
        machine_id: payload.machineId,
        operator_id: payload.operatorId || null,
        snapshot_id: payload.snapshotId || null,

        start_datetime: payload.startDatetime,
        end_datetime: payload.endDatetime || null,
        duration_minutes: payload.durationMinutes ?? null,

        type: payload.type || null,
        category: payload.category || null,
        severity: payload.severity || null,
        status: payload.status || 'OPEN',

        description: payload.description || null,
        root_cause: payload.rootCause || null,
        corrective_action: payload.correctiveAction || null,
        notes: payload.notes || null,
    });
}

export async function updateMaintenanceLogStatus(id, payload) {
    const record = await db.MachineMaintenanceLog.findByPk(id);
    if (!record) return null;

    if (payload.status) record.status = payload.status;
    if (payload.endDatetime) {
        record.end_datetime = payload.endDatetime;
    }
    if (payload.durationMinutes !== undefined) {
        record.duration_minutes = payload.durationMinutes;
    }
    if (payload.rootCause !== undefined) {
        record.root_cause = payload.rootCause;
    }
    if (payload.correctiveAction !== undefined) {
        record.corrective_action = payload.correctiveAction;
    }
    if (payload.notes !== undefined) {
        record.notes = payload.notes;
    }

    await record.save();
    return record;
}

export async function listMaintenanceLogs(filters = {}, pagination = {}) {
    const where = {};

    if (filters.machineId) {
        where.machine_id = filters.machineId;
    }

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.category) {
        where.category = filters.category;
    }

    if (filters.severity) {
        where.severity = filters.severity;
    }

    // filtro por data de início
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
            { model: db.User, as: 'Operator', attributes: ['id', 'name'] },
            {
                model: db.MachineProductionSnapshot,
                as: 'Snapshot',
                attributes: ['id', 'snapshot_datetime'],
            },
        ],
        order: [['start_datetime', 'DESC'], ['id', 'DESC']],
    };

    if (typeof limit === 'number') options.limit = limit;
    if (typeof offset === 'number') options.offset = offset;

    return db.MachineMaintenanceLog.findAll(options);
}

export async function getMaintenanceLogById(id) {
    return db.MachineMaintenanceLog.findByPk(id, {
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
