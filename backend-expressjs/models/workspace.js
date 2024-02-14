"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Workspace extends Model {
    static associate(models) {
      Workspace.hasMany(models.Board, {
        foreignKey: "workspace_id",
        as: "boards",
      });
    }
  }
  Workspace.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Workspace",
      tableName: "workspaces",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Workspace;
};
