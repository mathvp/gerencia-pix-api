const Bank = require('../models/Bank');
const PixKey = require('../models/PixKey');
const User = require('../models/User');
const UserBanks = require('../models/UserBanks');
const UserCustomBankData = require('../models/UserCustomBankData');

const bankList = require('bancos-brasileiros');

function getBankFromList(bankCode) {
  return bankList.find(bank => bank.COMPE == bankCode)
}

function getCustomBankData(userBanks, userBankId) {
  return userBanks.find( userBank => userBank.id === userBankId );
}

function formatBanksResponseData(rawBankData) {
  const newBankData = new Array(rawBankData.banks.length);

  rawBankData.banks.forEach(bank => {
    let tempBank = {
      code: null,
      name: null,
      longName: null,
      image: null,
      color: null,
      order: null,
      pix_keys: []
    };

    const bankFromList = getBankFromList(bank.code);

    if (!bankFromList) {
      console.log(`Erro ao listar banco com o código ${bank.code}`);
      return;
    }

    tempBank.code = bank.code;
    tempBank.name = bankFromList.ShortName;
    tempBank.longName = bankFromList.LongName;
    tempBank.image = bank.image_url;
    tempBank.order = 9999;

    const userBank = getCustomBankData(rawBankData.userBanks, bank.user_banks.id);
    const customBankData = userBank.customBankData[0];

    if (typeof customBankData != 'undefined' ) {
      tempBank.name = customBankData.custom_bank_name ? customBankData.custom_bank_name : tempBank.name;
      tempBank.image = customBankData.custom_bank_image_url ? customBankData.custom_bank_image_url : tempBank.image;
      tempBank.color = customBankData.custom_bank_color ? customBankData.custom_bank_color : tempBank.color;
      tempBank.order = customBankData.custom_bank_order;
    }

    tempBank.pix_keys = userBank.pix_keys

    if (tempBank.order > newBankData.length) {
      newBankData.push(tempBank)
    } else {
      newBankData[tempBank.order] = tempBank;
    }
  });

  return newBankData.filter(String);
}

module.exports = {
  async index(req, res) {
    const user_id = req.userId;
    const { bank_code } = req.params;
    const where_conditions = bank_code? { code: bank_code } : {}

    const user = await User.findByPk(user_id, {
      include: [
        {
          model: UserBanks,
          as: 'userBanks',
          include: [
            {
              model: UserCustomBankData,
              as: 'customBankData'
            },
            {
              model: PixKey,
              as: 'pix_keys'
            },
          ]
        },
        {
          model: Bank,
          as: 'banks',
          where: where_conditions,
        }
      ],
      order:[
        ['userBanks', 'customBankData', 'custom_bank_order', 'asc']
      ]
    });

    if(!user) {
      return res.status(404).json({ error: 'User not found! ' });
    }

    return res.status(200).json(formatBanksResponseData(user));
  },

  async store(req, res) {
    const user_id = req.userId;
    const { code, custom_bank_name, custom_bank_color, custom_bank_image_url, custom_bank_order } = req.body;

    const user = await User.findByPk(user_id);

    if(!user) {
      return res.status(404).json({ error: 'User not found! ' });
    }

    const [ bank ] = await Bank.findOrCreate({
      where: { code },
      defaults: { code }
    });

    const [ user_banks ] = await user.addBank(bank);

    const custom_bank_data = await UserCustomBankData.create({
      custom_bank_name,
      custom_bank_color,
      custom_bank_image_url,
      custom_bank_order,
      user_banks_id: user_banks.id
    });

    return res.status(200).json(custom_bank_data);
  },

  async delete(req, res) {
    const { bank_code } = req.params;
    const user_id = req.userId;

    try {

      const user = await User.findByPk(user_id);

      if(!user) {
        return res.status(404).json({ error: 'User not found! ' });
      }

      const bank = await Bank.findOne({
        where: { code: bank_code }
      });

      if(!bank) {
        return res.status(404).json({ msg: 'Banco não encontrado' });
      }

      await user.removeBank(bank);

      return res.status(200).json({ msg: 'Banco excluído com sucesso' });

    } catch(error) {
      console.log(error);
      return res.status(500).json({ msg: 'Erro ao excluir o Banco' });
    }
  },
};