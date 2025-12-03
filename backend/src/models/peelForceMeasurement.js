// backend/src/models/peelForceMeasurement.js
export default (sequelize, DataTypes) => {
    const PeelForceMeasurement = sequelize.define(
        'PeelForceMeasurement',
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },

            // média global (front + back) em Newtons
            value_n: {
                type: DataTypes.FLOAT,
                allowNull: false,
                comment: 'Average peel force in Newtons (global mean of all points)',
            },

            ribbon_type: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: 'Ex: Busbar 0.5x0.2mm',
            },

            ribbon_batch: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            flux_type: {
                type: DataTypes.STRING,
                allowNull: true, // ex: no-clean flux 951
            },

            cell_type: {
                type: DataTypes.STRING,
                allowNull: true, // PERC / TOPCon / IBC etc
            },

            // já não é obrigatório
            zone: {
                type: DataTypes.ENUM('TOP', 'BOTTOM', 'CENTER'),
                allowNull: true,
            },

            operator_notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            measurement_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            // 🔹 novas colunas para o ensaio completo
            warehouse_temperature: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Warehouse temperature in °C',
            },

            machine_temperature: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Machine temperature in °C',
            },

            machine_vacuum: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Machine vacuum (e.g. -0.95)',
            },

            // aqui guardamos o grid completo (front/back, ribbons, 14 pontos)
            grid_data: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: 'Full peel force grid: front/back · ribbons 1/5/10 · 14 points',
            },
        },
        {
            tableName: 'PeelForceMeasurements',
            underscored: true,
        },
    );

    PeelForceMeasurement.associate = (models) => {
        PeelForceMeasurement.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
        });

        PeelForceMeasurement.belongsTo(models.User, {
            foreignKey: 'operator_id',
        });
    };

    return PeelForceMeasurement;
};
