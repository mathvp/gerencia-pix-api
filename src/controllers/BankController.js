const Bank = require('../models/Bank');
const PixKey = require('../models/PixKey');
const User = require('../models/User');
const sequelize = require('../database');

module.exports = {
  async index(req, res) {
    const { user_id, bank_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: {
        model: Bank,
        as: 'banks',
        include: {
          model: PixKey,
          as: 'pix_keys'
        },
      }
    });

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    return res.status(200).json(user.banks);
  },

  async store(req, res) {
    const { user_id } = req.params;
    const { name, image_url } = req.body;

    const user = await User.findByPk(user_id);

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    const bank = await Bank.create({
      name,
      image_url,
      user_id,
    });

    return res.status(200).json(bank);
  },

  async index2(req, res) {

  },

  async store2(req, res) {
    const { user_id } = req.params;
    const { code, image_url, alias } = req.body;

    const user = await User.findByPk(user_id);

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    const [ bank ] = await Bank.findOrCreate({
      where: { code },
      defaults: { code, image_url, alias }
    });

    await sequelize.sync();

    await user.addBank(bank);

    return res.status(200).json(bank);
  },
};