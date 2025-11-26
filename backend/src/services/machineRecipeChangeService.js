// backend/src/services/machineRecipeChangeService.js
import db from '../models/index.js';
import { Op } from 'sequelize';

export async function createMachineRecipeChange(payload) {
    return db.MachineRecipeChange.create({
        machine_id: payload.machineId,
        operator_id: payload.operatorId || null,
        snapshot_id: payload.snapshotId || null,
        change_datetime: payload.changeDatetime,

        parameter_group: payload.parameterGroup || null,
        parameter_name: payload.parameterName,
        old_value: payload.oldValue || null,
        new_value: payload.newValue,
        unit: payload.unit || null,
        reason: payload.reason || null,
        notes: payload.notes || null,
    });
}

export async function listMachineRecipeChanges(filters = {}, pagination = {}) {
    const where = {};

    if (filters.machineId) {
        where.machine_id = filters.machineId;
    }

    if (filters.snapshotId) {
        where.snapshot_id = filters.snapshotId;
    }

    if (filters.parameterGroup) {
        where.parameter_group = filters.parameterGroup;
    }

    if (filters.parameterName) {
        where.parameter_name = { [Op.like]: `%${filters.parameterName}%` };
    }

    if (filters.from || filters.to) {
        where.change_datetime = {};
        if (filters.from) {
            where.change_datetime[Op.gte] = new Date(filters.from);
        }
        if (filters.to) {
            where.change_datetime[Op.lte] = new Date(filters.to);
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
        order: [['change_datetime', 'DESC'], ['id', 'DESC']],
    };

    if (typeof limit === 'number') options.limit = limit;
    if (typeof offset === 'number') options.offset = offset;

    return db.MachineRecipeChange.findAll(options);
}

export async function getMachineRecipeChangeById(id) {
    return db.MachineRecipeChange.findByPk(id, {
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
