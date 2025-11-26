import { createSnapshot, listSnapshots } from '../services/machineSnapshotService.js';

export async function createSnapshotController(req, res) {
    try {
        const { id: machineId } = req.params;
        const operatorId = req.user.sub;
        const payload = req.body;

        const snapshot = await createSnapshot(machineId, operatorId, payload);
        return res.status(201).json(snapshot);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Error creating snapshot' });
    }
}

export async function listSnapshotsController(req, res) {
    try {
        const { id: machineId } = req.params;
        const { from, to } = req.query;

        const snapshots = await listSnapshots(machineId, { from, to });
        return res.json(snapshots);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Error listing snapshots' });
    }
}
