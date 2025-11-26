import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from '../src/models/index.js';

async function seedAdmin() {
    const plainPassword = 'admin123';
    const password_hash = await bcrypt.hash(plainPassword, 10);

    const [user, created] = await db.User.findOrCreate({
        where: { email: 'admin@example.com' },
        defaults: {
            name: 'Admin',
            email: 'admin@example.com',
            password_hash,
            role: 'admin',
        },
    });

    console.log(created ? 'Admin criado.' : 'Admin já existia.');
    console.log('Login: admin@example.com / admin123');
}

async function seedMachines() {
    const machinesData = [
        {
            name: 'Stringer 1',
            code: 'STR-01',
            type: 'stringer',
        },
        {
            name: 'Stringer 2',
            code: 'STR-02',
            type: 'stringer',
        },
        {
            name: 'Layup 1',
            code: 'LAY-01',
            type: 'layup',
        },
    ];

    for (const data of machinesData) {
        const [machine, created] = await db.Machine.findOrCreate({
            where: { code: data.code },
            defaults: {
                ...data,
                is_active: true,
            },
        });
        console.log(
            created
                ? `Machine criada: ${machine.name} (${machine.code})`
                : `Machine já existia: ${machine.name} (${machine.code})`,
        );
    }
}

async function main() {
    try {
        console.log('Ligando à base de dados...');
        await db.sequelize.authenticate();
        console.log('Ligação OK.');

        console.log('Sincronizando modelos (sequelize.sync)...');
        await db.sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas.');

        await seedAdmin();
        await seedMachines();

        console.log('Seed completo ✅');
        process.exit(0);
    } catch (err) {
        console.error('Erro no devSyncAndSeed:', err);
        process.exit(1);
    }
}

main();
