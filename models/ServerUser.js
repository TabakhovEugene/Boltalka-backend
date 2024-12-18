const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const { User } = require('./User');
const { Server }  = require('./Server');

module.exports = () => {
    class ServerUser extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsTo(models.User, { foreignKey: 'user' });
            this.belongsTo(models.Server, { foreignKey: 'server' });
        }
    }

    ServerUser.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            server: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_creator: DataTypes.BOOLEAN,
            is_admin: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'ServerUser',
            tableName: 'servers_users',
            timestamps: false,
        }
    );

    return ServerUser;
};
