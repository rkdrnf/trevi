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

router.get('/edit', function(req, res) {
	Place.find().populate('region').lean().exec(function(err, places) {
		if (err) {
			console.log(err);
		}
		res.render('admin/places/edit', { places: places });
	});
});

router.post('/create', function(req, res, next) {	
	Place.create({ name: req.body.name , region: req.body.region , latitude: req.body.latitude , longitude: req.body.longitude }, function(err, place) {
		if (err) {	 
			console.log(err);
			return handleError(err);
		}

		Region.update({ _id: req.body.region}, { $addToSet: { places: place._id }}, function(err) {
			if (err) console.log(err);
		});
		res.redirect('./');
	});
});

router.get('/delete/:id', function(req, res, next) {
	var id = req.params.id;
	Place.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log(err);
			return handleError(err);
		} else {
			Region.update({ places: id }, { $pull: { places: id }}, function(err) {
				if (err) console.log(err);
			});

			if (req.query.redirect_url)
				res.redirect(req.query.redirect_url);
			else
				res.redirect('../');
		}
	});
});

router.get('/deleteAll', function(req, res) {
	Place.remove({}, function() {
		res.redirect('./');
	});
});

module.exports = router;
