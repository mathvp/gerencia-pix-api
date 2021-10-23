const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserAccount = require('../models/UserAccount');
const sequelize = require('../database');
const config = require('../config/auth.config');
const User = require('../models/User');
const { errors } = require('puppeteer');

module.exports = {
  async store(req, res) {

    const t = await sequelize.transaction();

    try {

      const {
        first_name,
        last_name,
        email,
        password,
        birth_date_day,
        birth_date_month,
        birth_date_year,
        gender
      } = req.body;

      const userAccount = await UserAccount.create({
        email,
        password: bcrypt.hashSync(password, 8),
      }, { transaction: t });

      const user = await userAccount.createUser({
        first_name,
        last_name,
        birth_date_day,
        birth_date_month,
        birth_date_year,
        gender,
      }, { transaction: t });

      await t.commit();

      return res.status(200).json({ account: userAccount.email, 'user_data': user });

    } catch (error) {
      await t.rollback();

      if (error.errors.length) {
        if (error.errors[0].type === 'notNull Violation') {
          return res.status(400).json({ message: 'Há um campo em branco...' })
        }
      }

      return res.status(400).json({ error });
    }
  },

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
