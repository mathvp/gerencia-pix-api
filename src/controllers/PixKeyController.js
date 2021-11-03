const User = require('../models/User');
const PixKey = require('../models/PixKey');
const getUserBank = require('../utils');

module.exports = {
  async index(req, res) {
    const { bank_code } = req.params;
    const user_id = req.userId;

    const userBank = await getUserBank(user_id, bank_code);

    const pix_keys = await PixKey.findAll({
      where: {
        user_banks_id: userBank.id
      }
    });

    if(!pix_keys) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    return res.status(200).json(pix_keys);
  },

  async store(req, res) {
    const { bank_code } = req.params;
    const { value } = req.body;
    const user_id = req.userId;

    const userBank = await getUserBank(user_id, bank_code);

    if(!userBank) {
      return res.status(400).json({ error: 'User or Bank not found! ' });
    }

    const pix_key = await PixKey.create({
      value,
      user_banks_id: userBank.id
    });

    return res.status(200).json(pix_key);
  },

  async delete(req, res) {
    const { bank_code, pix_key_id } = req.params;
    const user_id = req.userId;

    const userBank = await getUserBank(user_id, bank_code);

    try {
      const deleted = await PixKey.destroy({
        where: {
          id: pix_key_id,
          user_banks_id: userBank.id
        }
      });

      if(!deleted) {
        return res.status(404).json({ msg: 'Chave Pix não encontrada' });
      }

      return res.status(200).json({ msg: 'Chave Pix excluída com sucesso' });

    } catch(error) {
      console.log(error);
      return res.status(500).json({ msg: 'Erro ao excluir a Chave Pix' });
    }
  },

  async update(req, res) {
    const { bank_code, pix_key_id } = req.params;
    const { value } = req.body;
    const user_id = req.userId;

    const userBank = await getUserBank(user_id, bank_code);

    try {
      await PixKey.update({
          value
        },
        {
          where: {
            id: pix_key_id,
            user_banks_id: userBank.id
          }
      }).then(count => {
        if(count > 0) {
          return res.status(200).json({ msg: `${ count } Chave Pix atualizada!` });
        }

        return res.status(404).json({ error: 'Chave Pix ou Banco não encontrado!' });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Chave Pix ou Banco não encontrado!' });
    }

  }
};