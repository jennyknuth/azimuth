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
  console.log(response)
  var UV_Value = response.body;
  console.log(UV_Value);
  res.json(UV_Value)
})
})


module.exports = router;
