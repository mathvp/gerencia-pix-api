const User = require('../models/User');

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

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    await User.create({
      first_name,
      last_name,
      email,
      password
    }).then((created_user) => {
      return res.json(created_user);
    }).catch((error) => {
      console.log(error);
      return res.status(500).send({ error: "Houve um erro ao criar o usuário" });
    });

  }
};