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
        tableName: 'users',   // Tabela em maiúscula
        underscored: true,    // created_at / updated_at
    });

    User.associate = (models) => {
        User.hasMany(models.MachineProductionSnapshot, {
            foreignKey: 'operator_id',
            as: 'productionSnapshots',
        });
    };

    return User;
};
