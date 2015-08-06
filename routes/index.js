var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool UV Name' });
});


/* POST */
router.post('/', function (req, res, next) {
  //when we send a post request, it should look like this URL:
  // http://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/80306/JSON
  res.redirect('index')
})




module.exports = router;
