"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "workspace_id_active", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "workspaces",
        },
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "workspace_id_active");
  },
};
