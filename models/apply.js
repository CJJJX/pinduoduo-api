'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Apply.init({
    account: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
         notNull: {
             msg: '发布求职申请的账号必须存在'
           },
           notEmpty: {
             msg: '发布求职申请的账号不能为空'
           },
           len: {
             args: 11,
             msg: '发布求职申请的账号长度需要为11个字符'
           }   
      }
     },
     title: {
      type: DataTypes.STRING,
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
     content: {
       type:  DataTypes.TEXT,
       allowNull: false,
      validate: {
       notNull: {
         msg: '内容必须存在'
       },
       notEmpty: {
         msg: '内容不能为空'
       }
     }
     }
    
  }, {
    sequelize,
    modelName: 'Apply',
  });
  return Apply;
};