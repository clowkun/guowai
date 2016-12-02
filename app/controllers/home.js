
// Azure storage import
var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env()
     .file({ file: 'config.json', search: true });
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");

var passport = require('passport');
var passportLocalStrategy = require('passport-local').Strategy;


var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

var UserList = require('./userlist');
var User = require('../models/user');
var user = new User(azure.createTableService(accountName, accountKey), tableName, partitionKey);
var userList = new UserList(user);

// Session
var app = express();
var session = require('express-session');
app.use(session({
    secret: '777F',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, true);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, false);
  });
});

passport.use(new passportLocalStrategy(
  function(username, password, done) {
    userList.findOne({ username: username, password: password }, function(err, user) {
      console.log("user created");
      return done(null, true, { message: true });
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


module.exports = function (app) {
  app.use('/', router);
  app.use('/login', router);
  app.use('/dashboard', router);
  app.get('/adduser', userList.addUser.bind(userList));
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Guowai',
    subtitle: 'Be familiar in a foreign setting'
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'})
);

router.get('/signin', function (req, res, next) {
	res.render('SignUp');
});

router.get('/dashboard', function (req, res, next) {
	res.render('dashboard');
});
