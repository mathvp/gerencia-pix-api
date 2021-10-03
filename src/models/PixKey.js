const { Model, DataTypes } = require('sequelize');

class PixKey extends Model {
  static init (sequelize) {
    super.init({
      value: DataTypes.STRING(45),
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', through: 'user_banks', as: 'users' });
    this.belongsTo(models.Bank, { foreignKey: 'bank_code', through: 'user_banks', as: 'banks' });
  }
}

module.exports = PixKey;