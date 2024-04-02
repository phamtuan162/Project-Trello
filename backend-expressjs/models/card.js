"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    static associate(models) {
      Card.belongsTo(models.Column, {
        foreignKey: "column_id",
        as: "columns",
      });
      Card.belongsToMany(models.User, {
        foreignKey: "card_id",
        through: "users_cards",
        as: "users",
      });
    }
  }
  Card.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      column_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      desc: DataTypes.STRING,
      background: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Card",
      tableName: "cards",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Card;
};
