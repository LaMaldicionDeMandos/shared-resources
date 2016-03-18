exports.index = function(req, res) {
  res.render('index', {activation: false});
};

exports.main = function(req, res) {
  res.render('main');
};