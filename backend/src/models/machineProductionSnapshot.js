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
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },

            operator_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },

            snapshot_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            shift: {
                type: DataTypes.STRING(16),
                allowNull: true,
            },

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
            tableName: 'machineproductionsnapshots',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    MachineProductionSnapshot.associate = (models) => {
        MachineProductionSnapshot.belongsTo(models.Machine, {
            foreignKey: {
                name: 'machine_id',
                allowNull: false,
            },
            as: 'machine',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        MachineProductionSnapshot.belongsTo(models.User, {
            foreignKey: {
                name: 'operator_id',
                allowNull: true,
            },
            as: 'operator', // eu punha lowercase por consistência
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });

        MachineProductionSnapshot.hasMany(models.StringRejection, {
            foreignKey: 'snapshot_id',
            as: 'stringRejections', // idem, camelCase mais padrão
        });
    };

    return MachineProductionSnapshot;
};
