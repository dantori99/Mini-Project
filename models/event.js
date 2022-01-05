'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.event.hasMany(models.comment, {
        foreignKey: 'id_event'
      })
      models.event.hasMany(models.bookmark, {
        foreignKey: 'id_event'
      })
      models.event.belongsTo(models.user, {
        foreignKey: 'id_user'
      })
      models.event.belongsTo(models.category, {
        foreignKey: 'id_category'
      })
    }
  };
  event.init({
    title: DataTypes.STRING,
    imageEvent: DataTypes.STRING,
    detail: DataTypes.STRING,
    dateStart: DataTypes.STRING,
    dateEnd: DataTypes.STRING,
    organizer: DataTypes.STRING,
    link: DataTypes.STRING,
    nameSpeaker: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    id_category: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'event',
  });
  return event;
};