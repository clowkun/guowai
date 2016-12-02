
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


module.exports = function (app) {
  app.use('/', router);
  app.use('/login', router);
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

router.post('/login', function (req, res, next) {
    console.log('post login form');
    // Get the credentials that are being passed in from the user
    console.log(req.body);
    if (!req.body.name || !req.body.password) {
        console.log('post login form failed');
    } else if (req.body.name === "wap" || req.body.password === "test") {
        // Check them against our data
        req.session.user = "wap"
        req.session.admin = true;
        // Set a session variable so that a user can access the private side of the site
        console.log('post login form succeeded');
        res.render('dashboard');
    }
});

router.get('/signin', function (req, res, next) {
	res.render('SignUp');
});