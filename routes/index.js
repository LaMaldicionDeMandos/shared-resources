exports.index = function(req, res) {
  console.log("going to index");
  if (req.isAuthenticated()) {
    console.log("user authenticated, rendering main");
    res.render('home', {activation: null, user: req.user});
  } else {
    console.log("user not authenticated, rendering index");
    res.render('index');
  }

};

exports.main = function(req, res) {
  res.render('home', {activation: null, user: req.user});
};