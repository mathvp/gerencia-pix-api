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
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Bank, { foreignKey: 'bank_id', as: 'bank' });
  }
}

module.exports = PixKey;