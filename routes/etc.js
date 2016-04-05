var router = require('express').Router();


router.get('/dontknow', function(req, res) {
	res.render('etc/dontknow');
});

router.get('/restaurants', function(req, res) {
	res.render('etc/restaurants');
});


module.exports = router;
