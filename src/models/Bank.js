const { Model, DataTypes } = require('sequelize');

class Bank extends Model {
  static init (sequelize) {
    super.init({
      code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      image_url:  DataTypes.TEXT,
      alias: DataTypes.STRING(45),
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.belongsToMany(models.User, { foreignKey: 'fk_bank_code', through: 'user_banks', as: 'users' });
    this.hasMany(models.PixKey, { foreignKey: 'bank_code', as: 'pix_keys' });
    this.hasMany(models.UserCustomBankData, { foreignKey: 'bank_code', as: 'custom_bank_data' });
  }
}

module.exports = Bank;