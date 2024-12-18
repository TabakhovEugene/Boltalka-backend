const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Server = require('./Server');

module.exports = (sequelize) => {
    class TextChannel extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsTo(models.Server, { foreignKey: 'server_id' });
        }
    }

    TextChannel.init(
        {
            text_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: DataTypes.STRING,
            server_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'TextChannel',
            tableName: 'text_channels',
            timestamps: false,
        }
    );

    return TextChannel;
};
