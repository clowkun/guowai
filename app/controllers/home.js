var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
  app.use('/login', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'guowai: study abroad and go further hi Nathan',
      articles: articles
    });
});

router.get('/login', function (req, res, next) {
    res.send('Please log in');
});
