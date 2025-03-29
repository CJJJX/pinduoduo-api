'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chat.init({
    account: {
      type:DataTypes.STRING(11),
      allowNull: false,
      validate: {
       notNull: {
         msg: '发起与智能助手对话的账号'
       },
       notEmpty: {
         msg: '发起与智能助手对话的账号不能为空'
       },
       len: {
        args: 11,
        msg: '发起与智能助手对话的账号必须为11位字符串'
      }
    }
  },
    content: {
     type: DataTypes.TEXT,
     allowNull: false,
      validate: {
       notNull: {
         msg: '聊天记录的内容必须存在'
       },
       notEmpty: {
         msg: '聊天记录的内容不能为空'
       }
     }
    },
  msgType: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};