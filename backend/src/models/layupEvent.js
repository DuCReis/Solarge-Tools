// backend/src/models/layupEvent.js

export default (sequelize, DataTypes) => {
    const LayupEvent = sequelize.define(
        'LayupEvent',
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

            event_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            // STRING_DIVERTED / STRING_PLACED / FAULT / RECOVERY / OTHER
            type: {
                type: DataTypes.STRING(32),
                allowNull: false,
            },

            // Lado/linha da layup: ex: A / B / C
            lane: {
                type: DataTypes.STRING(16),
                allowNull: true,
            },

            // Posição relativa (nº da string no painel/stack)
            position_index: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            // Se a string era boa (do ponto de vista elétrico/visual)
            is_good_string: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },

            // SOURCE: MACHINE (auto) / OPERATOR (manual)
            source: {
                type: DataTypes.STRING(16),
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
            tableName: 'layupevents',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    LayupEvent.associate = (models) => {
        LayupEvent.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
            as: 'Machine',
            constraints: false,
        });

        LayupEvent.belongsTo(models.User, {
            foreignKey: 'operator_id',
            as: 'Operator',
            constraints: false,
        });

        LayupEvent.belongsTo(models.MachineProductionSnapshot, {
            foreignKey: 'snapshot_id',
            as: 'Snapshot',
            constraints: false,
        });
    };

    return LayupEvent;
};
