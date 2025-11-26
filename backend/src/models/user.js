export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('operator', 'engineer', 'admin'),
            allowNull: false,
            defaultValue: 'operator'
        }
    }, {
        tableName: 'Users',   // Tabela em maiúscula
        underscored: true,    // created_at / updated_at
    });

    User.associate = (models) => {
        // No futuro: relações com snapshots, etc.
    };

    return User;
};
