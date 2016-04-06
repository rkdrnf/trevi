var express = require('express');
var multer = require('multer');
var router = express.Router();
var upload = multer({ dest: 'public/images/place_photos/'});
var Photo = require('../../models/photo.js');
var processImages = require('../../helper/modify_and_upload.js');

var Place = require('../../models/place.js');
var Region = require('../../models/region.js');
var RouterHelper = require('../../helper/router_helper.js');
var Restaurant = require('../../models/restaurant.js');


router.get('/', function(req, res) {
	var query = {};
	if (req.query.region_id) {
		query.region = req.query.region_id;
	}
	Place.find(query).populate('region').lean().exec(function(err, places) {
		if (err) {
			console.log(err);
		}
		res.render('admin/places/index', { places: places });
	});
});

router.get('/new', RouterHelper.getAllRegions('_id name'), function(req, res) {
	res.render('admin/places/new', { place_type: 'Plain' });
});

router.get('/edit/:id', RouterHelper.getAllRegions('_id name'), function(req, res) {
	Place.findOne({ _id: req.params.id }).populate('region photos').lean().exec(function(err, place) {
		if (err) {
			console.log(err);
			throw err;
		}

		res.render('admin/places/edit', { place: place, local_data: { place: place }});
	});
});

router.post('/update/:id', upload.array('photos[]'), processImages(function(req) { return req.files; }, {
	type: 'Place',
	saves: 'thumbnail'
}, {
	type: 'Place',
	saves: 'thumbnail'
}), function(req, res){
	var values = req.processedImages.files.map(function(fileInfo) {
		return {
			original: fileInfo.original,
			thumbnail: fileInfo.thumbnail,
			masonry: fileInfo.masonry,
		};
	});

	var categories = req.body.categories.split(' ').map(function(category) { return category.trim(); }).filter(function(category) { return category.length > 0; });

	var updateQuery = {
		name: req.body.name, 
		region: req.body.region, 
		latitude: req.body.latitude, 
		longitude: req.body.longitude, 
		categories: categories, 
		description: req.body.description
	};

	var placeModel = Place;
	console.log(req.body.type);

	if (req.body.type === 'Restaurant') {
		var menus = req.body.menus.trim().split(' ').map(function(menu) { return menu.trim(); }).filter(function(menu) { return menu.length > 0; }).map(function(menu) {
			var splits = menu.split('/');
			return {
				name: splits[0],
				price: splits[1]
			};
		});

		updateQuery.menus = menus;
		console.log(req.body.price_level);
		updateQuery.price_level = req.body.price_level;
		placeModel = Restaurant;
	}


	if (values.length > 0) {
		Photo.create(values, function(err, photos) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				updateQuery.photos = photos;
				placeModel.update({ _id: req.params.id }, updateQuery, function(err) {
					if (err) {
						console.log(err);
						throw err;
					}
					res.redirect('../');
				});
			}
		});
	} else {
		placeModel.update({ _id: req.params.id }, updateQuery, function(err) {
			if (err) {
				console.log(err);
				throw err;
			}
			res.redirect('../');
		});
	}
});

router.post('/create', upload.array('photos[]'), processImages(function(req) { return req.files; }, {
	type: 'Place',
	svaes: 'thumbnail'
}, {
	type: 'Place',
	saves: 'thumbnail'
}), function(req, res) {	
	var values = req.processedImages.files.map(function(fileInfo) {
		return {
			original: fileInfo.original,
			thumbnail: fileInfo.thumbnail,
			masonry: fileInfo.masonry,
		};
	});

	var categories = req.body.categories.split(' ').map(function(category) { return category.trim(); }).filter(function(category) { return category.length > 0; });
	
	var createQuery = { 
		name: req.body.name,
	 	region: req.body.region, 
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		categories: categories,
		description: req.body.description,
		type: req.body.type,
		menus: req.body.menus
	};

	var placeModel = Place;

	if (req.body.type === 'Restaurant') {
		var menus = req.body.menus.trim().split(' ').map(function(menu) { return menu.trim(); }).filter(function(menu) { return menu.length > 0; }).map(function(menu) {
			var splits = menu.split('/');
			return {
				name: splits[0],
				price: splits[1]
			};
		});

		createQuery.menus = menus;
		createQuery.price_level = req.body.price_level;
		placeModel = Restaurant;
	}

	Photo.create(values, function(err, photos) {
		if (err) {
			console.log(err);
			throw err; 
		}

		var photo_ids = photos ? photos.map(function(photo) { return photo._id; }) : [];
		createQuery.photos = photo_ids;

		placeModel.create(createQuery, function(err, place) {
			if (err) {	 
				console.log(err);
				throw err;
			}

			Region.update({ _id: req.body.region}, { $addToSet: { places: place._id }}, function(err) {
				if (err) console.log(err);
			});
			res.redirect('./');
		});
	});
});

router.get('/delete/:id', function(req, res) {
	var id = req.params.id;
	Place.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log(err);
			throw err;
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
