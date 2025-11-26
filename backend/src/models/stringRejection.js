export default (sequelize, DataTypes) => {
    const StringRejection = sequelize.define('StringRejection', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        // quem rejeitou originalmente
        source: {
            type: DataTypes.ENUM('MACHINE', 'OPERATOR'),
            allowNull: false,
            comment: 'MACHINE = rejeitada automaticamente; OPERATOR = rejeitada pelo humano',
        },

        // tipo de defeito
        category: {
            type: DataTypes.ENUM('UPS', 'MC', 'RM', 'BC', 'OTHER', 'GOOD_REJECTED'),
            allowNull: false,
        },

        // se a string estava boa mas foi rejeitada (pelo sistema)
        is_good_string: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'true = string boa mas rejeitada (false positive)',
        },

        side: {
            type: DataTypes.ENUM('LEFT', 'CENTER', 'RIGHT'),
            allowNull: true,
            comment: 'Posição da string no painel (se aplicável)',
        },

        // coordenadas normalizadas do defeito na célula (para MC map)
        mc_x: {
            type: DataTypes.FLOAT,
            allowNull: true,
            comment: '0.0–1.0 normalizado na largura da célula',
        },
        mc_y: {
            type: DataTypes.FLOAT,
            allowNull: true,
            comment: '0.0–1.0 normalizado na altura da célula',
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'StringRejections',
        underscored: true,
    });

    StringRejection.associate = (models) => {
        StringRejection.belongsTo(models.Machine, {
            foreignKey: 'machine_id',
        });

        StringRejection.belongsTo(models.User, {
            foreignKey: 'operator_id',
        });

        // opcional: ligar à snapshot de produção em que isto aconteceu
        StringRejection.belongsTo(models.MachineProductionSnapshot, {
            foreignKey: 'snapshot_id',
        });
    };

    return StringRejection;
};
