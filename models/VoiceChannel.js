const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Server = require('./Server');


module.exports = (sequelize) => {
    class VoiceChannel extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsTo(models.Server, { foreignKey: 'server_id' });
        }
    }

    VoiceChannel.init(
        {
            voice_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            max_people: {
                type: DataTypes.INTEGER,
            },
            server_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'VoiceChannel',
            tableName: 'voice_channels',
            timestamps: false,
        }
    );

    return VoiceChannel;
};