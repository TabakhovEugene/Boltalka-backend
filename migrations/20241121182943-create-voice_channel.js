'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('voice_channels', {
      voice_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      max_people: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      server_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servers',
          key: 'server_id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('voice_channels');
  }
};
