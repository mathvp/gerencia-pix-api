const User = require('../models/User');
const PixKey = require('../models/PixKey');

module.exports = {
  async index(req, res) {
    const { user_id, bank_code } = req.params;

    const pix_keys = await PixKey.findAll({
      where: {
        user_id,
        bank_code
      }
    });

    if(!pix_keys) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    return res.status(200).json(pix_keys);
  },

  async store(req, res) {
    const { user_id, bank_code } = req.params;
    const { value } = req.body;

    const user = await User.findByPk(user_id, {
      include: {
        association: 'banks',
        where: { 'code': bank_code }
      }
    });

    if(!user) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    const pix_key = await PixKey.create({
      value,
      user_id,
      bank_code,
    });

    return res.status(200).json(pix_key);
  },
};