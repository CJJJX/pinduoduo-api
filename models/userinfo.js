'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserInfo.init({
    account: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notNull: {
          msg: '创建用户详细信息的账号必须存在'
        },
        notEmpty: {
          msg: '创建用户详细信息的账号不能为空'
        },
        len: {
          args: 11,
          msg: '创建用户详细信息的账号长度需要为11个字符'
        }
      }
    },
    userName: DataTypes.STRING,
    realName: DataTypes.STRING,
    sex: DataTypes.INTEGER,
    phoneNumber: DataTypes.STRING,
    fixedEmail: DataTypes.STRING,
    school: DataTypes.STRING,
    status: DataTypes.INTEGER,
    certification: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'UserInfo',
  });
  return UserInfo;
};