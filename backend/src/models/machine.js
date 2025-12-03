export default (sequelize, DataTypes) => {
    const Machine = sequelize.define('Machine', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            // código curto tipo "STR-01"
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        type: {
            type: DataTypes.ENUM('stringer', 'layup', 'other'),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'machines',
        underscored: true,
    });

    Machine.associate = (models) => {
        Machine.hasMany(models.MachineProductionSnapshot, {
            foreignKey: 'machine_id',
        });
    };

    return Machine;
};
