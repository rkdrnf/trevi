var express = require('express');
var router = express.Router();

var Place = require('../../models/place.js');
var Region = require('../../models/region.js');

router.get('/', function(req, res) {
	Place.find().populate('region').lean().exec(function(err, places) {
		if (err) {
			console.log(err);
		}
		res.render('admin/places/index', { places: places });
	});
});

router.get('/new', function(req, res) {
	Region.find().lean().exec(function(err, regions) {
		res.render('admin/places/new', { regions: regions });
	});
});

router.post('/create', function(req, res, next) {	
	Place.create({ name: req.body.name , region: req.body.region , latitude: req.body.latitude , longitude: req.body.longitude }, function(err) {
		if (err) {	 
			console.log(err);
			return handleError(err);
		}
		res.redirect('./');
	});
});

router.get('/delete/:id', function(req, res, next) {
	Place.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log(err);
			return handleError(err);
		}

		if (req.query.redirect_url)
			res.redirect(req.query.redirect_url);
		else
			res.redirect('../');
	});
});

router.get('/deleteAll', function(req, res) {
	Place.remove({}, function() {
		res.redirect('./');
	});
});

module.exports = router;
