var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});

/* POST */
router.post('/', function (req, res, next) {
console.log("req", req.body.zip);

 res.redirect('/')

})



module.exports = router;
