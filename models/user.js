'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.event, {
        foreignKey: 'id_user'
      })
      models.user.hasMany(models.comment, {
        foreignKey: 'id_user'
      })
      models.user.hasMany(models.bookmark, {
        foreignKey: 'id_user'
      })
    }
  };
  user.init({
    avatar: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'user',
  });
  return user;
};