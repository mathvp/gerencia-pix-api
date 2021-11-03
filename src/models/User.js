const bcrypt = require("bcrypt");
const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init (sequelize) {
    super.init({
      first_name: DataTypes.STRING(45),
      last_name:  DataTypes.STRING(64),
      email:      DataTypes.STRING(45),
      password:   DataTypes.STRING(82),
    }, {
      sequelize,
      hooks: {
        beforeSave: async user => {
          const salt = await bcrypt.genSalt(10);
          const password = await bcrypt.hash(user.password, salt);
          user.password = password;
        }
      }
    });
  }

  static associate(models) {
    this.belongsToMany(models.Bank, { foreignKey: 'fk_user_id', through: 'user_banks', as: 'banks' });
    this.hasMany(models.PixKey, { foreignKey: 'user_banks_id', as: 'pix_keys' });
    this.hasMany(models.UserCustomBankData, { foreignKey: 'user_banks_id', as: 'customBankData' });
    this.hasMany(models['user_banks'], { foreignKey: 'fk_user_id', as: 'userBanks' });
  }
}

module.exports = User;