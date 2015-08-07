var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});



router.post('/UV', function (req, res, next) {
  var zip = axios.get('//iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/' + req.body.zip + '/JSON')
  var latlong = axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.zip + '&components=postal_code&key=' + process.env.GOOGLE_KEY)

  Promise.all([zip, latlong])
  .then(function(values) {
    var epa = values[0].data
    var geocode = values[1].data
    var time = new Date
    var hour = time.getHours();
    var UV_Value = 0;

    epa.forEach(function(block) {
      var epaTime = block.DATE_TIME
      epaTime = epaTime.split(' ')
      console.log(epaTime)
      epaHour = parseInt(epaTime[1], 10)
      console.log('parsed hour', epaHour);
      if ((epaTime[2] === "PM" && epaHour !=12) || (epaTime[2] ==="AM" && epaHour ===12) ) {

          epaHour = epaHour + 12
          console.log(epaHour)



        // if (epaHour === 24) {
        //   epaHour = 12
        // }
      }
      if (epaHour === hour) {
        console.log('time now', epaHour);
        UV_Value = block.UV_VALUE
        console.log('hi', UV_Value)
      }
    })

    var lat = geocode.results[0].geometry.location.lat
    var long = geocode.results[0].geometry.location.lng
    console.log('lat', lat);
    console.log('long', long);
    console.log(UV_Value);
    res.json({UV: UV_Value, lat: lat, long: long});

  })
})



router.get('/UV', function(req, res, next) {
  res.status(200).json(req.body);
});

module.exports = router;
