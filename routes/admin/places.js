var express = require('express');
var router = express.Router();

var Place = require('../../models/place.js');

router.get('/', function(req, res) {
	Place.find().lean().exec(function(err, places) {
		res.render('admin/places/index', { places: places });
	});
});
router.get('/new', function(req, res, next) {
		res.render('admin/places/new');
});


module.exports = router;
