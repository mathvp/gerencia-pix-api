const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init (sequelize) {
    super.init({
      first_name: DataTypes.STRING(45),
      last_name:  DataTypes.STRING(64),
      email:      DataTypes.STRING(45),
      password:   DataTypes.STRING(82),
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.Bank, { foreignKey: 'user_id', as: 'banks' });
  }
}

module.exports = User;