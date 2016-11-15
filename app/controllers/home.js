
// Azure storage import
var azure_storage = require('azure-storage');
var nconf = require('nconf');
nconf.env()
     .file({ file: 'config.json', search: true });
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");

var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

var UserList = require('./userlist');
var User = require('../models/user');
var user = new User(azure.createTableService(accountName, accountKey), tableName, partitionKey);
var userList = new UserList(user);



module.exports = function (app) {
  app.use('/', router);
  app.use('/login', router);
  app.post('/addtask', taskList.addTask.bind(taskList));
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Guowai',
      subtitle: 'Be familiar in a foreign setting',
      articles: articles
    });
});

router.get('/login', function (req, res, next) {
    res.send('Please log in');
});
