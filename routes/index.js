var express = require('express');
var router = express.Router();
var unirest = require('unirest')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});

/* POST */
router.post('/UV', function (req, res, next) {
console.log("req", req.body.zip);
unirest.get('http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/' + req.body.zip + '/JSON')
.end(function (response) {
  var UV_Value = response.body;
  res.render('locations', {data: UV_Value});
  console.log(UV_Value);
  res.json(UV_Value
})



module.exports = router;
