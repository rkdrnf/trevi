var express = require('express');
var multer = require('multer');
var router = express.Router();
var upload = multer({ dest: 'public/images/place_photos/'});
var PlacePhoto = require('../../models/place_photo.js');
var MAU = require('../../helper/modify_and_upload.js');

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

router.post('/create', upload.array('photos[]'), function(req, res, next) {	
	var newPhotos = req.files.map(function(newPhoto) {
		return {
			path: PlacePhoto.placeImagePath + newPhoto.filename,
			thumbnail: PlacePhoto.thumbnailPath + newPhoto.filename,
		};
	});

	console.log(newPhotos);

	PlacePhoto.create(newPhotos, function(err, photos) {
		if (err) console.log(err);
		var photo_ids = photos.map(function(photo) { return photo._id; });
		Place.create({ name: req.body.name , region: req.body.region , latitude: req.body.latitude , longitude: req.body.longitude , photos: photo_ids }, function(err, place) {
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
