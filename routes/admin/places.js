var express = require('express');
var multer = require('multer');
var router = express.Router();
var upload = multer({ dest: 'public/images/place_photos/'});
var Photo = require('../../models/photo.js');
var processImages = require('../../helper/modify_and_upload.js');

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

router.get('/edit/:id', function(req, res) {
	Place.findOne({ _id: req.params.id }).populate('region photos').lean().exec(function(err, place) {
		if (err) {
			console.log(err);
			throw err;
		}

		Region.find().lean().exec(function(err, regions) {
			res.render('admin/places/edit', { place: place, regions: regions, local_data: { place: place }});
		});
	});
});

router.post('/update/:id', upload.array('photos[]'), processImages(function(req) { return req.files; }, {
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

	Photo.create(values, function(err, photos) {
		if (err) {
			console.log(err);
			throw err;
		} else {
			Place.update({ _id: req.params.id }, { name: req.body.name, region: req.body.region, latitude: req.body.latitude, longitude: req.body.longitude, photos: photos }, function(err) {
				if (err) {
					console.log(err);
					throw err;
				}
				res.redirect('../');
			});
		}
	});
});

router.post('/create', upload.array('photos[]'), processImages(function(req) { return req.files; }, {
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

	Photo.create(values, function(err, photos) {
		if (err) {
			console.log(err);
			throw err; 
		}

		var photo_ids = photos.map(function(photo) { return photo._id; });
		Place.create({ name: req.body.name , region: req.body.region , latitude: req.body.latitude , longitude: req.body.longitude , photos: photo_ids }, function(err, place) {
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
