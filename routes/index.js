var express = require('express');
var router = express.Router();
var unirest = require('unirest')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});

/* POST */
router.post('/UV', function (req, res, next) {
unirest.get('http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/' + req.body.zip + '/JSON')
.end(function (response) {
console.log("req", req.body);
  var UV_Value = response.body;
  res.render('locations', {data: UV_Value});
  console.log(UV_Value);
  res.json(UV_Value);
})
  // unirest.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.zip + '&components=postal_code&key=AIzaSyDUbsioa0pOqLv4QGeZBRfdUqizxn0B934')
  // .end(function (response) {
  //   var lat = respons
  // })
})






module.exports = router;
