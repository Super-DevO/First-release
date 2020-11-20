var express = require('express');
var router = express.Router();

//middleware to check if the user is logged in
//todo: you need to make a query to the database "users" and check if the users credentials are correct
const authAdminUser = (req, res, next) => {
  
  //write here the code

  next();
}

//applying the middleware to all the routers that needs authentication
router.all('/', authAdminUser);

/* GET users listing. */
router.get('/', function(req, res, next) {
  //todo: write here the code
  res.send('respond with a resource');
});

/* POST users data. */
router.post('/', function(req, res, next) {
  //todo: write here the code
  res.send('respond with a resource');
});

/* DELETE users data. */
router.delete('/', function(req, res, next) {
  //todo: write here the code
  res.send('respond with a resource');
});

module.exports = router;