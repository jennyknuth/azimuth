var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});

router.post('/UV', function (req, res, next) {
  var lat, long;

  axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.zip + '&components=postal_code&key=' + process.env.GOOGLE_KEY).then(function (response) {
    lat = response.data.results[0].geometry.location.lat.toFixed(2);
    long = response.data.results[0].geometry.location.lng.toFixed(2);
    return axios.get('http://api.openweathermap.org/data/2.5/uvi?appid='+ process.env.OWM_KEY +'&lat=' + lat + '&lon=' + long);

  }).then(function (response) {
    var UV_Value = response.data.value;
    res.json({UV: UV_Value, lat: lat, long: long});
  });
})

router.get('/UV', function(req, res, next) {
  res.status(200).json(req.body);
});

module.exports = router;
