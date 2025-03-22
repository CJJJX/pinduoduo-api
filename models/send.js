'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Send extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Send.init({
    fromAccount: DataTypes.STRING(11),
    toAccount: DataTypes.STRING(11),
    jobId: DataTypes.INTEGER,
    resumeId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    imformation: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Send',
  });
  return Send;
};