// backend/src/models/ribbonSpool.js

export default (sequelize, DataTypes) => {
    const RibbonSpool = sequelize.define(
        'RibbonSpool',
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

            // Lado da máquina: LEFT / RIGHT / BOTH (para stringer com 2 ribbons)
            side: {
                type: DataTypes.STRING(16),
                allowNull: true,
            },

            batch_code: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },

            supplier: {
                type: DataTypes.STRING(128),
                allowNull: true,
            },

            material: {
                // ex: "Cu-Sn60", "Cu-Ag", etc.
                type: DataTypes.STRING(64),
                allowNull: true,
            },

            width_mm: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },

            thickness_mm: {
                type: DataTypes.DECIMAL(5, 3),
                allowNull: true,
            },

            // Pesos em gramas
            weight_start_g: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },

            weight_end_g: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },

            weight_current_g: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },

            // Consumo estimado por string (metros ou gramas por string, tu escolhes)
            estimated_consumption_per_string: {
                type: DataTypes.DECIMAL(10, 4),
                allowNull: true,
            },

            status: {
                // ACTIVE / FINISHED / PLANNED
                type: DataTypes.STRING(16),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },

            start_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            end_datetime: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            // opcional: ligar ao snapshot inicial / final
            start_snapshot_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            end_snapshot_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'ribbonspools',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    RibbonSpool.associate = (models) => {
        RibbonSpool.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
            as: 'Machine',
            constraints: false, // SEM FK física
        });

        RibbonSpool.belongsTo(models.MachineProductionSnapshot, {
            foreignKey: 'start_snapshot_id',
            as: 'StartSnapshot',
            constraints: false,
        });

        RibbonSpool.belongsTo(models.MachineProductionSnapshot, {
            foreignKey: 'end_snapshot_id',
            as: 'EndSnapshot',
            constraints: false,
        });
    };

    return RibbonSpool;
};
