import db from '../models/index.js';
import { Op } from 'sequelize';

export async function createSnapshot(machineId, operatorId, payload) {
    return db.MachineProductionSnapshot.create({
        machine_id: machineId,
        operator_id: operatorId,
        snapshot_datetime: payload.snapshotDatetime,

        placed_ribbons_partial:   payload.placedRibbonsPartial,
        placed_ribbons_total:     payload.placedRibbonsTotal,
        produced_cells_partial:   payload.producedCellsPartial,
        produced_cells_total:     payload.producedCellsTotal,
        rejected_cells_partial:   payload.rejectedCellsPartial,
        rejected_cells_total:     payload.rejectedCellsTotal,
        soldered_cells_partial:   payload.solderedCellsPartial,
        soldered_cells_total:     payload.solderedCellsTotal,
        produced_strings_partial: payload.producedStringsPartial,
        produced_strings_total:   payload.producedStringsTotal,
        rejected_strings_partial: payload.rejectedStringsPartial,
        rejected_strings_total:   payload.rejectedStringsTotal,

        waiting_time_sec: payload.waitingTimeSec,
        alarm_time_sec:   payload.alarmTimeSec,
        stop_time_sec:    payload.stopTimeSec,
        working_time_sec: payload.workingTimeSec,

        shift: payload.shift,
        notes: payload.notes,
    });
}

export async function listSnapshots(machineId, { from, to }) {
    const where = { machine_id: machineId };

    if (from || to) {
        where.snapshot_datetime = {};
        if (from) where.snapshot_datetime[Op.gte] = new Date(from);
        if (to) where.snapshot_datetime[Op.lte] = new Date(to);
    }

    return db.MachineProductionSnapshot.findAll({
        where,
        order: [['snapshot_datetime', 'DESC']],
        include: [
            { model: db.User, attributes: ['id', 'name'] },
        ],
    });
}
