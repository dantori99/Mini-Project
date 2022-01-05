'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.bookmark.belongsTo(models.user, {
        foreignKey: 'id_user'
      })
      models.bookmark.belongsTo(models.event, {
        foreignKey: 'id_event'
      })
    }
  };
  bookmark.init({
    id_user: DataTypes.INTEGER,
    id_event: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'bookmark',
  });
  return bookmark;
};