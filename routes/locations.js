var express = require('express');
var router = express.Router();

/* GET locations listing. */
router.get('/', function(req, res, next) {
  res.send('locations');
});

module.exports = router;
