'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_custom_banks_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user_banks', key: 'fk_user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bank_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user_banks', key: 'fk_bank_code' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      custom_bank_name: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      custom_bank_color: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      custom_bank_image_url: {
        type: Sequelize.TEXT('tiny'),
        allowNull: true,
      },
      custom_bank_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_custom_banks_data');
  }
};
