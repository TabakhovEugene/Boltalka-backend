const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = () => {
    class Server extends Model {
        static associate(models) {
            // Задайте ассоциации, если они есть
            this.belongsToMany(models.User, {
                through: 'ServerUser', // Название таблицы связи
                foreignKey: 'server', // Ключ в таблице связи
                otherKey: 'user', // Ключ в другой таблице (User)
            });
            this.hasMany(models.TextChannel, { foreignKey: 'server_id' });
            this.hasMany(models.VoiceChannel, { foreignKey: 'server_id' });
        }
    }

    Server.init(
        {
            server_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            description: DataTypes.STRING,
            logo_url: DataTypes.STRING,
            status: DataTypes.STRING,
            created_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Server',
            tableName: 'servers',
            timestamps: false,
        }
    );

    return Server;
};
