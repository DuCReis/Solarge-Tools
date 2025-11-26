import db from '../models/index.js';

export async function listMachines({ type, activeOnly } = {}) {
    const where = {};
    if (type) where.type = type;
    if (activeOnly) where.is_active = true;

    return db.Machine.findAll({
        where,
        order: [['name', 'ASC']],
    });
}

export async function getMachineById(id) {
    const machine = await db.Machine.findByPk(id);
    if (!machine) {
        const error = new Error('Machine not found');
        error.statusCode = 404;
        throw error;
    }
    return machine;
}
