// Application (server) file for Express Node JS

// Azure storage import
var azure_storage = require('azure-storage');

var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

