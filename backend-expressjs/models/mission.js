"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mission extends Model {
    static associate(models) {
      Mission.belongsTo(models.Work, {
        foreignKey: "work_id",
        as: "work",
      });
      Mission.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Mission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      work_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Mission",
      tableName: "missions",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Mission;
};
