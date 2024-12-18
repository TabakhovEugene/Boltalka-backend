const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User');

module.exports = (sequelize) => {
    class Friend extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsTo(models.User, { foreignKey: 'userId'});
        }
    }

    Friend.init(
        {
            friend_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Friend',
            tableName: 'friends',
            timestamps: false,
        }
    );

    return Friend;
};

