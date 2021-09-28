const Bank = require('../models/Bank');
const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: { association: 'banks' }
    });

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    return res.status(200).json(user.banks);
  },

  async store(req, res) {
    const { user_id } = req.params;
    const { name, image_url } = req.body;

    const user = User.findByPk(user_id);

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    const bank = await Bank.create({
      name,
      image_url,
      user_id,
    });

    return res.status(200).json(bank);
  }
};