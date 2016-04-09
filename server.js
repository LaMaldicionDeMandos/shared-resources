
/**
 * Module dependencies
 */
var fs = require('fs');
var xnconfig = require('nodejsconfig');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
config = xnconfig.parse(process.env.NODE_ENV, data);

var DB = require('./utils/database');

db = new DB(config.db_connection);

var express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  landing = require('./routes/landing'),
  modals = require('./routes/modals'),
  http = require('http'),
  path = require('path');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var permission = require('permission');
var app = module.exports = express();
var authenticationService = require('./services/authenticationService');

/**
 * Configuration
 */
var facebookRedirect = '/auth/facebook/callback';
app.enable('trust proxy');
app.set('port', process.env.PORT || 5000 /*config.port*/);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(cookieParser('secret corto'));
app.use(session({
  secret: 'secret corto',
  name: 'cookie_allotment',
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {maxAge: config.session_expire, secure: false}}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(landing.authenticate));
passport.use(new FacebookStrategy({
  clientID: config.auth_facebook_client_id,
  clientSecret: config.auth_facebook_secret,
  callbackURL: config.host + facebookRedirect,
  profileFields: ['id', 'email']
}, function(accessToken, refreshToken, profile, next) {
  console.log('Facebook login: accessToken: ' + accessToken + ', refreshToken: ' + refreshToken + ', profile: ' +
  JSON.stringify(profile));
  authenticationService.findByFacebookId(profile.id).then(
      function(user) {
        if (user) {
          next(null, user);
        } else {
          authenticationService.attachUserWithFacebook(profile).then(
              function(user) {
                next(null, user)
              },
              function(err) {
                next(err);
              }
          );
        }
      },
      function(err) {
        next(err);
      }
  );
}));

passport.serializeUser(function(user, done) {
  console.log("Serializing user: " + JSON.stringify(user));
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(jsonUser, done) {
  console.log("Deserielizing user: " + jsonUser);
  var sessionUser = JSON.parse(jsonUser);
  done(null, sessionUser);
});

var env = process.env.NODE_ENV || 'development';
var handleError = function(err, req, res, next) {
  next();
};
// development only
if (env === 'development') {
  app.use(handleError);
  app.use(errorHandler());
} else {
  app.use(handleError);
}

/**
 * Routes
 */

// Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email', failureRedirect: '/' }));
app.get(facebookRedirect, passport.authenticate('facebook', {failureRedirect: '/'}),
function(req, res) {
  console.log('Success Login with Facebook');
  res.redirect('/main')
});

var login = function(req, res, next) {
  console.log("Authenticanding: " + req.body.username);
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log("Error in authentication: " + JSON.stringify(info));
      return next(err);
    }
    console.log("user authenticated: " + JSON.stringify(user) + " doing login in session");
    req.login(user, function(err) {
      if (err) {
        console.log("Error in login into session: " + err);
        return next(err);
      }
      console.log("Login success, sending path to redirect");
      if (req.params.id) {
        return res.render('main', {activation: req.params.id});
      } else {
        return res.render('main', {activation: null});
      }
    });

  })(req, res, next);
};

// Local authentication
app.post('/login', login);

//Ejemplo de como aplicar permiso
//app.get(appPath + '/admin', permission(['admin', 'manager']), ping.health);

//Todos los post, put y delete necesitan role ADMIN
//app.post("*", permission(['ADMIN']));
//app.put(appPath + '/api/*', permission(['ADMIN']));
//app.delete("*", permission(['ADMIN']));

// serve index and view partials
app.get('/', routes.index);
app.get('/main', ensureAuthenticated, routes.main);
app.get('/modals/:view', ensureAuthenticated, modals.modals);

// Landing
app.post('/register', landing.register);
app.get('/user/active/:id', landing.active, login);

// JSON API
//app.get(appPath + '/api/allotments', ensureAuthenticated, api.allotments);

/**
 * Start Server
 */

var server = http.createServer(app);
server.listen(app.get('port'), function () {

});

server.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};
