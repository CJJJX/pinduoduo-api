'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resumes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resumeTitle: {
        type: Sequelize.STRING
      },
      authorName: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.STRING(11)
      },
      pictureUrl: Sequelize.TEXT('long'),
      tel: Sequelize.STRING,
      email: Sequelize.STRING,
      likeJobType: Sequelize.INTEGER,
      description: Sequelize.TEXT,
      birthday: Sequelize.STRING,
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
    await queryInterface.dropTable('Resumes');
  }
};