const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User');
const TextChannel = require('./TextChannel');


module.exports = (sequelize) => {
    class Message extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsTo(models.User, { foreignKey: 'user_id' });
            this.belongsTo(models.TextChannel, { foreignKey: 'text_id' });
        }
    }

    Message.init(
        {
            message_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            text_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Message',
            tableName: 'messages',
            timestamps: false,
        }
    );

    return Message;
};
