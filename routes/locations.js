var express = require('express');
var router = express.Router();
var unirest = require('unirest');

/* GET locations listing. */
router.get('/', function(req, res, next) {
  unirest.get('http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/80306/JSON')
  .end(function (response) {
    var UV_Value = response.body;
    res.render('locations', {data: UV_Value});
    console.log(UV_Value);
  })
  res.send('yo. make a locations view');
});


module.exports = router;
