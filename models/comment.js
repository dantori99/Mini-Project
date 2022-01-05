'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comment.belongsTo(models.user, {
        foreignKey: 'id_user'
      })
      models.comment.belongsTo(models.event, {
        foreignKey: 'id_event'
      })
    }
  };
  comment.init({
    id_user: DataTypes.INTEGER,
    id_event: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'comment',
  });
  return comment;
};