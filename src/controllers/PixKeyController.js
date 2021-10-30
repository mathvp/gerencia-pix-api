const User = require('../models/User');
const PixKey = require('../models/PixKey');

module.exports = {
  async index(req, res) {
    const { bank_code } = req.params;
    const user_id = req.userId;

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
    const { bank_code } = req.params;
    const { value } = req.body;
    const user_id = req.userId;

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

  async delete(req, res) {
    const { bank_code, pix_key_id } = req.params;
    const user_id = req.userId;

    try {
      const deleted = await PixKey.destroy({
        where: {
          id: pix_key_id,
          user_id,
          bank_code
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

    try {
      await PixKey.update({
          value
        },
        {
          where: {
            id: pix_key_id,
            user_id,
            bank_code
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