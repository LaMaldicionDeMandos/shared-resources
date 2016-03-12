
/**
 * Module dependencies
 */
var fs = require('fs');
/*
var xnconfig = require('nodejsconfig');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
config = xnconfig.parse(process.env.NODE_ENV, data);
*/

var express = require('express'),
//  request = require('request'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  landing = require('./routes/landing'),
  http = require('http'),
  path = require('path');

//var MemcachedStore = require('connect-memcached')(session);
//var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
//var permission = require('permission');
var app = module.exports = express();

//log.info("Port: " + config.port);
//var accountUrl = config.accounts_url;

//log.info("Session expire in: " + config.session_expire + "ms");

// all environments

/**
 * Configuration
 */
app.enable('trust proxy');
app.set('port', process.env.PORT || 5000 /*config.port*/);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
/*app.use(cookieParser('secret corto'));
app.use(session({
  secret: 'secret corto',
  store: new MemcachedStore({hosts: [config.security_memcached]}),
  name: 'cookie_allotment',
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {maxAge: config.session_expire, secure: false}}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    function(username, password, done) {
      log.info("Login: username: " + username);
      var user = {email: username, password:password};
      log.info("Sending request to accounting");
      request({method:'post', url: accountUrl, body: user, json: true, headers: header()}, function(error, response, body) {
        if (!error && response.statusCode == 201) {
          log.info("Request success: " + JSON.stringify(body));
          var user = userFactory.create(body);
          if (user) {
            done(null, user);
          } else {
            done(new Error("The user hasn't role"));
          }
        } else {
          done(error || new Error(response.message))
        }
      })
    }
));

passport.serializeUser(function(user, done) {
  log.info("Serializing user: " + JSON.stringify(user));
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(jsonUser, done) {
  log.info("Deserielizing user: " + jsonUser);
  var sessionUser = JSON.parse(jsonUser);
  log.info("Token: " + sessionUser.token);
  if (!sessionUser.currentCountry) {
    sessionUser.currentCountry = sessionUser.countries[0];
  }
  done(null, sessionUser);
});
*/
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

//var appPath = '/allotment/flights';

//Login
/*
app.post(appPath + '/login', function(req, res, next) {
  log.info("Authenticanding: " + req.body.username);
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      log.info("Error in authentication: " + JSON.stringify(info));
      return next(err);
    }
    log.info("user authenticated: " + JSON.stringify(user) + " doing login in session");
    req.login(user, function(err) {
      if (err) {
        log.info("Error in login into session: " + err);
        return next(err);
      }
      log.info("Login success, sending path to redirect");
      return res.send(appPath);
    });

  })(req, res, next);
});
*/
//Ejemplo de como aplicar permiso
//app.get(appPath + '/admin', permission(['admin', 'manager']), ping.health);

//Todos los post, put y delete necesitan role ADMIN
//app.post("*", permission(['ADMIN']));
//app.put(appPath + '/api/*', permission(['ADMIN']));
//app.delete("*", permission(['ADMIN']));

// serve index and view partials
app.get('/', routes.index);
app.get('/main', routes.main);

// Landing
app.post('/register', landing.register);

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
    if(req.cookies.currentCountry && req.user.countries.indexOf(req.cookies.currentCountry)>=0) {
      req.user.currentCountry = req.cookies.currentCountry;
    } else {
      req.user.currentCountry = req.user.countries[0];
    }
    return next();
  }
  return res.redirect(appPath + '/login');
};
