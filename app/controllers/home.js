
// Azure storage import
var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env()
     .file({ file: 'config.json', search: true });
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");


var express = require('express'),
    router = express.Router(),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser');

var UserList = require('./userlist');
var User = require('../models/user');
var user = new User(azure.createTableService(accountName, accountKey), tableName, partitionKey);
var userList = new UserList(user);

// Session
var app = express();



module.exports = function (app) {
  app.use(cookieParser());

  app.use(expressSession({
      secret: '777F',
      resave: false,
      saveUninitialized: false,
      cookie: {
          path: '/',
          httpOnly: true,
          maxAge: 30000
      }
  }));
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

router.post('/login', function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.redirect('/login');
  } else {
    if (req.body.username === "wap" && req.body.password === "test") {
      req.session.username = req.body.username;
      res.redirect('/dashboard');
    }
  }
});

router.get('/signin', function (req, res, next) {
  res.render('SignUp');
});

router.get('/dashboard', function (req, res, next) {
  if (req.session.username) {
    res.render('dashboard');
  } else {
    res.redirect('/login');    
  }
});
