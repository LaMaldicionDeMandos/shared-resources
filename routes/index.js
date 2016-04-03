exports.index = function(req, res) {
  if (req.isAuthenticated()) {
    res.render('main');
  }
  res.render('index', {activation: false});
};

exports.main = function(req, res) {
  res.render('main');
};