export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Machines', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM('stringer', 'layup', 'other'),
            allowNull: false
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
    await queryInterface.dropTable('Machines');
}
