const Test = require('../models/TestModel');

module.exports = {
  async index(req, res) {
    const test = new Test;
    return res.status(200).json({
      'test' : test.data
    });
  }
}