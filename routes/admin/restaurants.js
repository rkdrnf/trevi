var router = require('express').Router();
var multer = require('multer');
var upload = multer({ dest: 'public/images/place_photos/' });
var Photo = require('../../models/photo.js');
var processImages = require('../../helper/modify_and_upload.js');

var Restaurant = require('../../models/restaurant.js');
var Region = require('../../models/region.js');
var RouterHelper = require('../../helper/router_helper.js');

router.get('/', function(req, res) {
	var query = {};
	if (req.query.region_id) {
		query.region = req.query.region_id;
	}
	Restaurant.find(query).populate('region').lean().exec(function(err, rests) {
		if (err) {
			console.log(err);
		}
		res.render('admin/restaurants/index', { restaurants: rests })
	});
});

router.get('/new', RouterHelper.getAllRegions('_id name'), function(req, res) {
	res.render('admin/places/new', { place_type: 'Restaurant' });
});

router.get('/edit/:id', RouterHelper.getAllRegions('_id name'), function(req, res) {
	Restaurant.findById(req.params.id).populate('region photos').lean().exec(function(err, rest) {
		if (err) {
			console.log(err);
			throw err;
		}

		res.render('admin/places/edit', { place: rest, local_data: { place: rest } });
	});
});

module.exports = router;
