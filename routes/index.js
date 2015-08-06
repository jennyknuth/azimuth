var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool UV Name' });
});


/* POST */
router.post('/', function (req, res, next) {
  res.redirect('index')
})




module.exports = router;
