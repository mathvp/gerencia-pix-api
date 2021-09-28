const Sequelize = require('sequelize');
const dbConfig = require('../config/database.config');

const User = require('../models/User');
const Bank = require('../models/Bank');

const connection = new Sequelize(dbConfig);

User.init(connection);
Bank.init(connection);

User.associate(connection.models);
Bank.associate(connection.models);

module.exports = connection;