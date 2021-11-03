const User = require('../models/User');

async function getUserBank(user_id, bank_code) {
  const user = await User.findByPk(user_id);
  const userBanksList = await user.getUserBanks()
  return userBanksList.find( userBank => userBank.fk_bank_code == bank_code)
}

module.exports = getUserBank;