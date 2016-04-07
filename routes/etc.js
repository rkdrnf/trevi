var router = require('express').Router();


router.get('/dontknow', function(req, res) {
	res.render('etc/dontknow');
});

router.get('/restaurants', function(req, res) {
	res.render('etc/restaurants');
});

router.get('/train', function(req, res) {
	res.render('etc/train');
});


module.exports = router;
