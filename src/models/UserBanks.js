const { Model, DataTypes } = require('sequelize');

class UserBanks extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fk_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        allowNull: false,
      },
      fk_bank_code: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'user_banks',
      modelName: 'user_banks',
    });
  }

  static associate(models) {
    this.hasMany(models.UserCustomBankData, { foreignKey: 'user_banks_id', as: 'customBankData' });
    this.hasMany(models.PixKey, { foreignKey: 'user_banks_id', as: 'pix_keys' });
    this.hasMany(models.Bank, { foreignKey: 'code', as: 'banks' });

  }
}

module.exports = UserBanks;