"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Workspace extends Model {
    static associate(models) {
      Workspace.hasMany(models.Board, {
        foreignKey: "workspace_id",
        as: "boards",
      });
      Workspace.belongsToMany(models.User, {
        foreignKey: "workspace_id",
        through: "users_workspaces_roles",
        as: "users",
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
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      color: DataTypes.STRING,
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
