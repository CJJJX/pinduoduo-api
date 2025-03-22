'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      requirement: {
        type: Sequelize.TEXT
      },
      publishAccount: {
        type:Sequelize.STRING(11),
        allowNull: false,
        validate: {
         notNull: {
           msg: '发布职位的账号必须存在'
         },
         notEmpty: {
           msg: '发布职位的账号不能为空'
         },
         len: {
          args: 11,
          msg: '发布职位的账号必须为11位字符串'
        }
      }
    },
    degree: Sequelize.INTEGER,
    jobType: Sequelize.INTEGER,
    salaryRange: Sequelize.STRING,
    majorType:  Sequelize.STRING,
    haveWrittenExam:  Sequelize.BOOLEAN,
    canEditOrDel:  Sequelize.BOOLEAN,
    fromCollege:Sequelize.INTEGER,
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
    await queryInterface.dropTable('Jobs');
  }
};