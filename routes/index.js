exports.index = function(req, res) {
  if (req.isAuthenticated()) {
    res.render('main', {activation: null});
  }
  res.render('index');
};

exports.main = function(req, res) {
  res.render('main', {activation: null});
};