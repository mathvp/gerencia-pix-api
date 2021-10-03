const banks = require('bancos-brasileiros');

function getImage(bankCode) {
  return '';
}

module.exports = {
  index(req, res) {
    const newBankList = banks.map(({
      COMPE,
      ShortName,
      LongName,
    }) => ({
        code: COMPE,
        name: ShortName,
        longName: LongName,
        image: getImage(COMPE),
    }));

    return res.status(200).json(newBankList);
  }
}