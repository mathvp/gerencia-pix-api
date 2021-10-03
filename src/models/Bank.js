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
    this.belongsToMany(models.User, { foreignKey: 'fk_bank_code', through: models.UserBanks, as: 'users' });
  }
}

module.exports = Bank;