var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/my_feed', function(req, res, next) {
  res.render('feed', { title: 'Express' });
});

router.get('/my_groups', function(req, res, next) {
  res.render('groups', { title: 'Express' });
});

router.get('/my_chat', function(req, res, next) {
  res.render('chats', { title: 'Express' });
});

router.get('/my_notebooks', function(req, res, next) {
  res.render('notebooks', { title: 'Express' });
});

module.exports = router;
