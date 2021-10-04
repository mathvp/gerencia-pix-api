const User = require('../models/User');
const UserCustomBankData = require('../models/UserCustomBankData');

module.exports = {
  async index(req, res) {
    const { user_id, bank_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: {
        association: '',
        where: { bank_id }
      }
    });

    if(!user) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    return res.status(200).json(user);
  },

  async store(req, res) {
    const { user_id, bank_code } = req.params;
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
};