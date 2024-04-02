"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Provider, {
        foreignKey: "provider_id",
        as: "providers",
      });

      User.hasMany(models.Device, {
        foreignKey: "user_id",
        as: "devices",
      });

      User.belongsToMany(models.Workspace, {
        foreignKey: "user_id",
        through: "users_workspaces_roles",
        as: "workspaces",
      });

      User.belongsToMany(models.Card, {
        foreignKey: "user_id",
        through: "users_cards",
        as: "cards",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      provider_id: DataTypes.INTEGER,
      workspace_id_active: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      background: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      avatar: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
