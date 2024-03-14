"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("workspaces", {
      fields: ["user_id"],
      type: "foreign key",
      name: "workspace_user_id_foreign",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "workspaces",
      "workspace_user_id_foreign"
    );
  },
};
