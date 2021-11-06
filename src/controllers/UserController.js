const User = require('../models/User');

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const bcrypt = require('bcrypt');

module.exports = {
  async store(req, res) {
    const {
      first_name,
      last_name,
      email
    } = req.body;

    let password = req.body.password;

    if (!(first_name && last_name && email && password)) {
      return res.status(400).send({ error: "Bad request" });
    }

    try {
      await User.create({
        first_name,
        last_name,
        email,
        password
      }).then((created_user) => {
        return res.json(created_user);
      });

    } catch (error) {
      let error_message = 'Houve um erro ao criar o usuário';

      if (error.errors[0].type === 'unique violation') {
        error_message = `O email ${email} já está cadastrado. Utilize outro ou recupere sua senha...`;
      }

      return res.status(500).send({ error: error_message });
    }

  },

  async login(req, res) {

    try {
      const { email, password } = req.body;

      if (email == undefined || email == null || password == undefined || password == null) {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
      }

      const user = await User.findOne({
        where: {
          email
        }
      }).then(user => {

        if (!user) {
          return res.status(401).json({ error: "Usuário ou senha incorretos" });
        }

        const isPasswordValid = bcrypt.compareSync(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return res.status(401).send({
            accessToken: null,
            error: "Usuário ou senha incorretos"
          });
        }

        const token = jwt.sign({ id: user.id }, `${config.secret}`, {
          expiresIn: 86400 // 24 hours
        });

        return res.status(200).json({
          id: user.id,
          email: user.email,
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