var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var axios = require('axios')
// var db = require('monk')(process.env.MONGLAB_URI);
// var locations = db.get('locations');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});




// .then(function(values) {
//   values[0]
// }).catch(function(errors) {
//   console.log(errors[0])
//   console.log(errors[1])
// })
router.post('/UV', function (req, res, next) {
  var zip = axios.get('http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/' + req.body.zip + '/JSON')
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
      epaHour = epaTime[1]

      if (epaHour[0] === '0') {
        epaHour = epaHour[1]
        console.log('epaHour', epaHour)
        epaHour = parseInt(epaHour)
      }
      if (epaTime[2] === "PM") {
        epaHour = parseInt(epaHour) + 12
      }
      if (typeof epaHour === 'string') {
        epaHour = parseInt(epaHour)
      }
      if (epaHour === hour) {
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



/* POST */
// router.post('/UV', function (req, res, next) {
//   unirest.get('http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/' + req.body.zip + '/JSON')
//   .end(function (response) {
//     var time = new Date
//     var hour = time.getHours();
//     var epaApi = response.body // an array
//     var UV_Value = 0;
//     epaApi.forEach(function(block) {
//
//       var epaTime = block.DATE_TIME
//       epaTime = epaTime.split(' ')
//       epaHour = epaTime[1]
//
//       if (epaHour[0] === '0') {
//         epaHour = epaHour[1]
//         epaHour = parseInt(epaHour)
//       }
//       if (epaTime[2] === "PM") {
//         epaHour = parseInt(epaHour) + 12
//       }
//       if (epaHour === hour) {
//         UV_Value = block.UV_VALUE
//         console.log('hi', UV_Value)
//       }
//     })
//     unirest.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.zip + '&components=postal_code&key=' + process.env.GOOGLE_KEY)
//     .end(function (response) {
//       var lat = response.body.results[0].geometry.location.lat
//       var long = response.body.results[0].geometry.location.lng
//       console.log('lat', lat);
//       console.log('long', long);
//       console.log(UV_Value);
//       res.json({UV: UV_Value, lat: lat, long: long});
//     })
//   })
// })

router.get('/UV', function(req, res, next) {
  res.status(200).json(req.body);
});

module.exports = router;
