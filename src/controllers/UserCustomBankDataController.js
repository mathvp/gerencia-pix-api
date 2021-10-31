const User = require('../models/User');
const Bank = require('../models/Bank');
const UserCustomBankData = require('../models/UserCustomBankData');

module.exports = {
  async index(req, res) {
    const { bank_code } = req.params;
    const user_id = req.userId;

    const custom_bank_data = await UserCustomBankData.findOne({
      where: {
        user_id,
        bank_code
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

    const user = await User.findByPk(user_id, {
      include: {
        association: 'banks',
        where: { 'code': bank_code }
      }
    });

    if(!user) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    const custom_bank_data = await UserCustomBankData.create({
      custom_bank_name,
      custom_bank_color,
      custom_bank_image_url,
      custom_bank_order,
      user_id,
      bank_code,
    });

    return res.status(200).json(custom_bank_data);
  },

  async sortOrder(req, res) {
    const user_id = req.userId;
    const { newOrders } = req.body;

    try {
      newOrders.forEach(bank => {
        UserCustomBankData.update({ custom_bank_order: bank.order },
          {
            where: { bank_code: bank.code, user_id }
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
      UserCustomBankData.update({
          custom_bank_name,
          custom_bank_color,
          custom_bank_image_url
        },
        {
          where: { bank_code: code, user_id }
        });

      return res.status(200).json({ msg: 'ok' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Banco não encontrado!' });
    }
  }
};