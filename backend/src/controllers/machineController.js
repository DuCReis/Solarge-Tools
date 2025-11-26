import { listMachines, getMachineById } from '../services/machineService.js';

export async function listMachinesController(req, res) {
    try {
        const { type, activeOnly } = req.query;
        const machines = await listMachines({
            type: type || undefined,
            activeOnly: activeOnly === 'true',
        });
        return res.json(machines);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error listing machines' });
    }
}

export async function getMachineController(req, res) {
    try {
        const { id } = req.params;
        const machine = await getMachineById(id);
        return res.json(machine);
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            message: err.statusCode === 404 ? 'Machine not found' : 'Error loading machine',
        });
    }
}
