// backend/src/models/machineProductionSnapshot.js

export default (sequelize, DataTypes) => {
    const MachineProductionSnapshot = sequelize.define(
        'MachineProductionSnapshot',
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

            snapshot_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            shift: {
                type: DataTypes.STRING(16), // ex: A, B, C, NIGHT, etc.
                allowNull: true,
            },

            // Contagem de produção
            total_strings: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },
            good_strings: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },

            // Rejeições por categoria
            rejected_mc: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },
            rejected_ups: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },
            rejected_rm: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },
            rejected_bc: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },
            rejected_other: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },

            // Strings boas rejeitadas pelo sistema / operador
            good_rejected: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                defaultValue: 0,
            },

            comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'machineproductionsnapshots', // bate com o que já tens na DB
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    MachineProductionSnapshot.associate = (models) => {
        MachineProductionSnapshot.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
            as: 'Machine',
        });

        MachineProductionSnapshot.belongsTo(models.User, {
            foreignKey: 'operator_id',
            as: 'Operator',
        });

        // Uma snapshot pode ter várias StringRejections ligadas
        MachineProductionSnapshot.hasMany(models.StringRejection, {
            foreignKey: 'snapshot_id',
            as: 'StringRejections',
        });
    };

    return MachineProductionSnapshot;
};
