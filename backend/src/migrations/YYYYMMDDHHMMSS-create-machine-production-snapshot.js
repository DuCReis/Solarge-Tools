export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('MachineProductionSnapshots', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        machine_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'Machines',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        operator_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        snapshot_datetime: {
            type: Sequelize.DATE,
            allowNull: false
        },

        placed_ribbons_partial:   { type: Sequelize.INTEGER.UNSIGNED },
        placed_ribbons_total:     { type: Sequelize.INTEGER.UNSIGNED },
        produced_cells_partial:   { type: Sequelize.INTEGER.UNSIGNED },
        produced_cells_total:     { type: Sequelize.INTEGER.UNSIGNED },
        rejected_cells_partial:   { type: Sequelize.INTEGER.UNSIGNED },
        rejected_cells_total:     { type: Sequelize.INTEGER.UNSIGNED },
        soldered_cells_partial:   { type: Sequelize.INTEGER.UNSIGNED },
        soldered_cells_total:     { type: Sequelize.INTEGER.UNSIGNED },
        produced_strings_partial: { type: Sequelize.INTEGER.UNSIGNED },
        produced_strings_total:   { type: Sequelize.INTEGER.UNSIGNED },
        rejected_strings_partial: { type: Sequelize.INTEGER.UNSIGNED },
        rejected_strings_total:   { type: Sequelize.INTEGER.UNSIGNED },

        waiting_time_sec: { type: Sequelize.INTEGER.UNSIGNED },
        alarm_time_sec:   { type: Sequelize.INTEGER.UNSIGNED },
        stop_time_sec:    { type: Sequelize.INTEGER.UNSIGNED },
        working_time_sec: { type: Sequelize.INTEGER.UNSIGNED },

        shift: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('MachineProductionSnapshots');
}
