var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});


/* POST */
router.post('/UV', function (req, res, next) {
console.log("res", res.body);
console.log("req", req.body);
  res.redirect('/')
})




module.exports = router;
