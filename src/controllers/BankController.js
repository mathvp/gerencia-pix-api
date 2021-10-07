const Bank = require('../models/Bank');
const PixKey = require('../models/PixKey');
const User = require('../models/User');
const UserCustomBankData = require('../models/UserCustomBankData');
const bankList = require('bancos-brasileiros');

function getBankFromList(bankCode) {
  return bankList.find(bank => bank.COMPE == bankCode)
}

function formatBanksResponseData(rawBankData) {
  const newBankData = [];

  rawBankData.forEach(bank => {
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

    if (bank.custom_bank_data.length > 0 ) {
      tempBank.name = bank.custom_bank_data[0].custom_bank_name ? bank.custom_bank_data[0].custom_bank_name : tempBank.name;
      tempBank.image = bank.custom_bank_data[0].custom_bank_image_url ? bank.custom_bank_data[0].custom_bank_image_url : tempBank.image;
      tempBank.color = bank.custom_bank_data[0].custom_bank_color ? bank.custom_bank_data[0].custom_bank_color : tempBank.color;
      tempBank.order = bank.custom_bank_data[0].custom_bank_order ? bank.custom_bank_data[0].custom_bank_order : tempBank.order;
    }

    tempBank.pix_keys = bank.pix_keys

    newBankData.push(tempBank);
  });

  return newBankData;
}

module.exports = {
  async index(req, res) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: {
        model: Bank,
        as: 'banks',
        include: [
          {
            model: PixKey,
            as: 'pix_keys'
          },
          {
            model: UserCustomBankData,
            as: 'custom_bank_data'
          }
        ]
      }
    });

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    return res.status(200).json(formatBanksResponseData(user.banks));
  },

  async store(req, res) {
    const { user_id } = req.params;
    const { code, custom_bank_name, custom_bank_color, custom_bank_image_url, custom_bank_order } = req.body;

    const user = await User.findByPk(user_id);

    if(!user) {
      return res.status(400).json({ error: 'User not found! ' });
    }

    const [ bank ] = await Bank.findOrCreate({
      where: { code },
      defaults: { code }
    });

    await user.addBank(bank);

    const custom_bank_data = await UserCustomBankData.create({
      custom_bank_name,
      custom_bank_color,
      custom_bank_image_url,
      custom_bank_order,
      user_id,
      bank_code: code,
    });

    return res.status(200).json(custom_bank_data);
  },
};