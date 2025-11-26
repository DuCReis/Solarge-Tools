// backend/src/models/machineMaintenanceLog.js

export default (sequelize, DataTypes) => {
    const MachineMaintenanceLog = sequelize.define(
        'MachineMaintenanceLog',
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

            // opcional: snapshot ligado ao período de produção
            snapshot_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            start_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            end_datetime: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            duration_minutes: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            type: {
                // planned / unplanned / breakdown / inspection / cleaning
                type: DataTypes.STRING(32),
                allowNull: true,
            },

            category: {
                // mechanical / electrical / software / flux / ribbons / other
                type: DataTypes.STRING(64),
                allowNull: true,
            },

            severity: {
                // LOW / MEDIUM / HIGH / CRITICAL
                type: DataTypes.STRING(16),
                allowNull: true,
            },

            status: {
                // OPEN / IN_PROGRESS / DONE
                type: DataTypes.STRING(16),
                allowNull: false,
                defaultValue: 'OPEN',
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            root_cause: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            corrective_action: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'machinemaintenancelogs',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    MachineMaintenanceLog.associate = (models) => {
        MachineMaintenanceLog.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
            as: 'Machine',
            constraints: false, // sem FK física no MySQL
        });

        MachineMaintenanceLog.belongsTo(models.User, {
            foreignKey: 'operator_id',
            as: 'Operator',
            constraints: false,
        });

        MachineMaintenanceLog.belongsTo(models.MachineProductionSnapshot, {
            foreignKey: 'snapshot_id',
            as: 'Snapshot',
            constraints: false,
        });
    };

    return MachineMaintenanceLog;
};
