var express = require('express');
var router = express.Router();

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Servey Site' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Servey Site' });
});

module.exports = router;
