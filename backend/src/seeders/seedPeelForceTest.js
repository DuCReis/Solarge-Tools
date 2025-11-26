import db from '../src/models/index.js';

async function main() {
    await db.sequelize.authenticate();
    console.log("DB Ok");

    await db.sequelize.sync({ alter: true });

    await db.PeelForceMeasurement.create({
        machine_id: 1,
        operator_id: 1,
        value_n: 3.2,
        zone: 'TOP',
        ribbon_type: '0.5x0.2mm',
        ribbon_batch: 'RB2025-08',
        flux_type: 'NC-951',
        cell_type: 'TOPCon',
        operator_notes: 'Bom valor, dentro do esperado.',
        measurement_datetime: new Date(),
    });

    console.log("Seed OK");
    process.exit(0);
}

main();
