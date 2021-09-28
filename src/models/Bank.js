const { Model, DataTypes } = require('sequelize');

class Bank extends Model {
  static init (sequelize) {
    super.init({
      name: DataTypes.STRING(45),
      image_url:  DataTypes.TEXT,
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = Bank;