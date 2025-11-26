// backend/src/models/machineRecipeChange.js

export default (sequelize, DataTypes) => {
    const MachineRecipeChange = sequelize.define(
        'MachineRecipeChange',
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },

            machine_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            operator_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            snapshot_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            change_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            // Grupo de parâmetro (temperatura, vacuum, velocidade…)
            parameter_group: {
                type: DataTypes.STRING(64),
                allowNull: true, // ex: 'TEMPERATURE', 'VACUUM', 'SPEED', 'FLUX', 'OTHER'
            },

            // Nome técnico do parâmetro (ex: top_zone_1, bottom_zone_3, flux_pct)
            parameter_name: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },

            old_value: {
                type: DataTypes.STRING(128),
                allowNull: true,
            },

            new_value: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },

            unit: {
                type: DataTypes.STRING(32), // ex: '°C', '%', 'm/min', 'mbar'
                allowNull: true,
            },

            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'machinerecipechanges',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    MachineRecipeChange.associate = (models) => {
        // Não vamos criar FKs físicas no MySQL (constraints: false),
        // mas mantemos as associações para poder usar include no Sequelize

        MachineRecipeChange.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
            as: 'Machine',
            constraints: false, // <- SEM FK no MySQL
        });

        MachineRecipeChange.belongsTo(models.User, {
            foreignKey: 'operator_id',
            as: 'Operator',
            constraints: false, // <- SEM FK no MySQL
        });

        MachineRecipeChange.belongsTo(models.MachineProductionSnapshot, {
            foreignKey: 'snapshot_id',
            as: 'Snapshot',
            constraints: false, // <- SEM FK no MySQL
        });
    };

    return MachineRecipeChange;
};
