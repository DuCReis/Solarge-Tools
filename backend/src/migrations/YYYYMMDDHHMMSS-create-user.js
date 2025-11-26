export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('operator', 'engineer', 'admin'),
            allowNull: false,
            defaultValue: 'operator'
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
    await queryInterface.dropTable('Users');
}
