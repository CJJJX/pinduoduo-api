'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    account: DataTypes.STRING,
    password: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notNull: {msg: '密码必须填写!'},
      notEmpty: {msg: '密码不能为空!'},
     },
     set(value) {
      if(value.length >= 6 && value.length <= 15) {
        this.setDataValue('password',bcrypt.hashSync(value,10))
      }else {
        throw new Error('密码长度必须是6 ~ 15位之间!')
      }
     }
    },
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};