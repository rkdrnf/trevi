var express = require('express');
var router = express.Router();


router.post('/upload_image', function(req, res, next) {
	console.log(req);

	res.json({ success: true });

});

module.exports = router;
