var express = require('express');
var router = express.Router();
var unirest = require('unirest')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sun Dial' });
});

/* POST */
router.post('/', function (req, res, next) {
console.log("req", req.body.zip);
<<<<<<< HEAD
=======

unirest.get('http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/80306/JSON')
.end(function (response) {
  var UV_Value = response.body;
  res.render('locations', {data: UV_Value});
  console.log(UV_Value);
  res.json(UV_Value)
  res.redirect('/')
})
})
>>>>>>> 33584636a1330327c6ad7f9bfd991727ebc47104

 res.redirect('/')

})



module.exports = router;
