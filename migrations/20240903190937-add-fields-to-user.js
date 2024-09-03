'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check existing columns
    const columns = await queryInterface.describeTable('users');

    // Add new columns if they don't exist
    if (!columns.dateCreated) {
      await queryInterface.addColumn('users', 'dateCreated', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }
    if (!columns.dateLastLoggedIn) {
      await queryInterface.addColumn('users', 'dateLastLoggedIn', {
        type: Sequelize.DATE
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    // Remove columns if needed
    await queryInterface.removeColumn('users', 'dateCreated');
    await queryInterface.removeColumn('users', 'dateLastLoggedIn');
  }
};
