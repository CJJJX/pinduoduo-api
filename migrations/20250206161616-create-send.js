'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromAccount: {
        type: Sequelize.STRING(11)
      },
      toAccount: {
        type: Sequelize.STRING(11)
      },
      jobId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      resumeId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      imformation: Sequelize.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sends');
  }
};