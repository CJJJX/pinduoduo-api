'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Job.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
       notNull: {
         msg: '标题必须存在'
       },
       notEmpty: {
         msg: '标题不能为空'
       },
       len: {
         args: [2,15],
         msg: '标题长度需要在2-15个字符之间'
       }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
       notNull: {
         msg: '职位描述必须存在'
       },
       notEmpty: {
         msg: '职位描述不能为空'
       }
     }
    },
    requirement: {
     type: DataTypes.TEXT,
     allowNull: false,
      validate: {
       notNull: {
         msg: '任职要求必须存在'
       },
       notEmpty: {
         msg: '任职要求不能为空'
       }
     }
    },
    publishAccount: {
      type:DataTypes.STRING(11),
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
  degree: DataTypes.INTEGER,
  jobType: DataTypes.INTEGER,
  salaryRange: DataTypes.STRING,
  majorType: DataTypes.STRING,
  haveWrittenExam: DataTypes.BOOLEAN,
  canEditOrDel: DataTypes.BOOLEAN,
  fromCollege: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};