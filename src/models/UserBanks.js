const { Model, DataTypes } = require('sequelize');

class UserBanks extends Model {
  static init (sequelize) {
    super.init({
      fk_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      fk_bank_code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'user_banks',
    });
  }
}

module.exports = UserBanks;