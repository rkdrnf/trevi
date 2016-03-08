var express = require('express');
var router = express.Router();


router.get('/new_journal', function(req, res, next) {
	res.render('journals/new');

});

module.exports = router;
