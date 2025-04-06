const RequestService = require('../services/RequestService');

exports.Index = async function (req, res) {
  return res.render('index');
};
