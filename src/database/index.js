const Sequelize = require('sequelize');
const dbConfig = require('../config/database.config');

const User = require('../models/User');
const Bank = require('../models/Bank');
const UserBanks = require('../models/UserBanks');
const PixKey  = require('../models/PixKey');
const UserCustomBankData  = require('../models/UserCustomBankData');

const connection = new Sequelize(dbConfig);

User.init(connection);
UserBanks.init(connection);
Bank.init(connection);
PixKey.init(connection);
UserCustomBankData.init(connection);

User.associate(connection.models);
Bank.associate(connection.models);
PixKey.associate(connection.models);
UserCustomBankData.associate(connection.models);
UserBanks.associate(connection.models);

module.exports = connection;