const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');


module.exports = () => {
    class User extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsToMany(models.Server, {
                through: 'ServerUser', // Название таблицы связи
                foreignKey: 'user', // Ключ в таблице связи
                otherKey: 'server', // Ключ в другой таблице (Server)
            });
            this.hasMany(models.Message, { foreignKey: 'user_id' });
        }
    }

    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
        }
    );

    return User;
};
