const User = require('../models/User');
const Bank = require('../models/Bank');
const UserCustomBankData = require('../models/UserCustomBankData');
const UserBanks = require('../models/UserBanks');
const getUserBanks = require('../utils');

module.exports = {
  async index(req, res) {
    const { bank_code } = req.params;
    const user_id = req.userId;

    const userBanks = await getUserBanks(user_id, bank_code)

    const custom_bank_data = await UserCustomBankData.findOne({
      where: {
        user_banks_id: userBanks.id
      }
    });

    if(!custom_bank_data) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    return res.status(200).json(custom_bank_data);
  },

  async store(req, res) {
    const { bank_code } = req.params;
    const user_id = req.userId;
    const { custom_bank_name, custom_bank_color, custom_bank_image_url, custom_bank_order } = req.body;

    const userBanks = await getUserBanks(user_id, bank_code)

    const custom_bank_data = await UserCustomBankData.create({
      custom_bank_name,
      custom_bank_color,
      custom_bank_image_url,
      custom_bank_order,
      user_banks_id: userBanks.id
    });

    return res.status(200).json(custom_bank_data);
  },

  async sortOrder(req, res) {
    const user_id = req.userId;
    const { newOrders } = req.body;

    try {
      newOrders.forEach(async bank => {
        const userBanks = await getUserBanks(user_id, bank.code)

        UserCustomBankData.update({ custom_bank_order: bank.order },
          {
            where: { user_banks_id: userBanks.id }
          });
      });

      return res.status(200).json({ msg: 'ok' });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'Banco não encontrado!' });
    }
  },

  async update(req, res) {
    const { bank_code } = req.params;
    const { code, custom_bank_name, custom_bank_color, custom_bank_image_url } = req.body;
    const user_id = req.userId;

    if (bank_code != code || bank_code == '' || typeof bank_code === 'undefined') {
      return res.status(404).json({ error: 'Banco não encontrado!' });
    }

    try {
      const userBanks = await getUserBanks(user_id, bank_code)

      UserCustomBankData.update({
        custom_bank_name,
        custom_bank_color,
        custom_bank_image_url
      },{
        where: {
          user_banks_id: userBanks.id
        }
      });

      return res.status(200).json({ msg: 'ok' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Banco não encontrado!' });
    }
  }
};