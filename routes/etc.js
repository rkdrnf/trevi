var router = require('express').Router();


router.get('/dontknow', function(req, res) {
	res.render('etc/dontknow');
});


module.exports = router;
