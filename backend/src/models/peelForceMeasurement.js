export default (sequelize, DataTypes) => {
    const PeelForceMeasurement = sequelize.define('PeelForceMeasurement', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        value_n: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: 'Peel force em Newtons',
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

        zone: {
            type: DataTypes.ENUM('TOP', 'BOTTOM', 'CENTER'),
            allowNull: false,
        },

        operator_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        measurement_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'PeelForceMeasurements',
        underscored: true,
    });

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
