const { Model, DataTypes } = require('sequelize');

class UserCustomBankData extends Model {
  static init (sequelize) {
    super.init({
      custom_bank_name: DataTypes.STRING(64),
      custom_bank_color: DataTypes.STRING(10),
      custom_bank_image_url: DataTypes.TEXT('tiny'),
      custom_bank_order: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: 'user_custom_banks_data'
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', through: 'user_banks', as: 'users' });
    this.belongsTo(models.Bank, { foreignKey: 'bank_code', through: 'user_banks', as: 'banks' });
  }
}

module.exports = UserCustomBankData;