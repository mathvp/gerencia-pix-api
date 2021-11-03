const { Model, DataTypes } = require('sequelize');
const UserBanks = require('./UserBanks');

class UserCustomBankData extends Model {
  static init (sequelize) {
    super.init({
      custom_bank_name: DataTypes.STRING(64),
      custom_bank_color: DataTypes.STRING(10),
      custom_bank_image_url: DataTypes.TEXT('tiny'),
      custom_bank_order: DataTypes.INTEGER,
      user_banks_id: {
        type: DataTypes.INTEGER,
        references: {
          model: UserBanks,
          key: 'id'
        }
      },
    }, {
      sequelize,
      tableName: 'user_custom_banks_data'
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_banks_id', through: 'user_banks', as: 'users' });
    this.belongsTo(models.Bank, { foreignKey: 'user_banks_id', through: 'user_banks', as: 'banks' });
  }
}

module.exports = UserCustomBankData;