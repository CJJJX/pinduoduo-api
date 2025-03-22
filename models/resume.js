'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Resume.init({
    resumeTitle: DataTypes.STRING,
    authorName: DataTypes.STRING,
    pictureUrl: DataTypes.TEXT('long'),
    account: DataTypes.STRING(11),
    tel: DataTypes.STRING,
    email: DataTypes.STRING,
    likeJobType: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    birthday: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Resume',
  });
  return Resume;
};