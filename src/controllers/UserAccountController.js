const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserAccount = require('../models/UserAccount');
const sequelize = require('../database');
const config = require('../config/auth.config');

module.exports = {

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (email == undefined || email == null || password == undefined || password == null) {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
      }

      const account = await UserAccount.findOne({
        where: {
          email
        },
        include: ['user']
      }).then(account => {

        if (!account) {
          return res.status(401).json({ error: "Usuário ou senha incorretos" });
        }

        const isPasswordValid = bcrypt.compareSync(
          password,
          account.password
        );

        if (!isPasswordValid) {
          return res.status(401).send({
            accessToken: null,
            error: "Usuário ou senha incorretos"
          });
        }

        const token = jwt.sign({ id: account.user.id }, `${config.secret}`, {
          expiresIn: 86400 // 24 hours
        });

        return res.status(200).json({
          id: account.user.id,
          email: account.email,
          accessToken: token
        });

      }).catch(error => {
        console.log(error);
        return res.status(500).json({ error: "Erro interno no servidor" });
      });


    } catch(error) {
      console.log(error);
    }
  },

  async logout(req, res) {
    return res.status(200).json({
      accessToken: null
    });
  }
};
