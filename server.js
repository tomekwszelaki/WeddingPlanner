/**
 * Created by tomasj on 28/01/14.
 */
var config =  require('./config');
var winston = require("winston");
//winston.add(winston.transports.File, {filename: '../app.log', level: 'debug'}).remove(winston.transports.Console);
var express = require('express');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var common = require('./backend/utils/common');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
//      console.log('accessToken:' + accessToken);
//      console.log('profile: ', profile._json);
      common.upsertUser(profile._json, function(err, body) {
          if (err) {
              return done(err);
          }
          return done(null, body);
      });
    });
  }
));


var app = express();

app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'this-is-my-awesome-super-secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Load the routes ("controllers" -ish)
['./backend/routes/guests', './backend/routes/files'].forEach(function (routePath) {
    require(routePath)(app);
});

//OK, routes are loaded, NOW use the router:
app.use(app.router);

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/loggedin', function(req, res) {
    console.log('loggedin: ', req.isAuthenticated() && req.user.is_admin);
    console.log('user: ', req.user);
    res.send((req.isAuthenticated() && req.user.is_admin) ? req.user : '0');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(config.express.port, function (error) {
  if (error) {
    winston.error("Unable to listen for connections", error);
    process.exit(10);
  }
  winston.info("express is listening on port " + config.express.port);
});
