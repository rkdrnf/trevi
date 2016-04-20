var express = require('express');
var multer = require('multer');
var Region = require('../models/region.js'); 
var router = express.Router();
var routerHelper = require('../helper/router_helper.js');
var upload = multer({ dest: 'public/images/profile_photos/'});
var Photo = require('../models/photo.js');
var processImages = require('../helper/modify_and_upload.js');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/edit_profile', routerHelper.checkUserLoggedIn, function(req, res) {
	res.render('users/edit_profile');
});

router.get('/show_profile', routerHelper.checkUserLoggedIn, function(req, res) {
	res.render('users/show_profile');
});


router.post('/update_profile', routerHelper.checkUserLoggedIn, upload.single('profile_photo'), processImages(function(req) { return req.file ? [req.file] : []; }, { type: 'User', saves: 'thumbnail' }), function(req, res) {
	console.log('#########################');
	console.log(req.processedImages);
	var values = req.processedImages.files.map(function(fileInfo) {
		return {
			original: fileInfo.original,
			thumbnail: fileInfo.thumbnail,
			owner: req.user._id
		};
	});

	if (values[0]) {
		Photo.create(values[0], function(err, photo) {
			if (err) {
				console.log(err);
			}
			req.user.profile_photo = photo._id;
			req.user.save(function (err) {
				if (err) console.log(err);
			});
		});
	}

	req.user.local.name = req.body.name;
	req.user.local.email = req.body.email;
	req.user.sex = req.body.sex;
	var birth = new Date(+req.body.birth_year, +req.body.birth_month - 1, +req.body.birth_date);
	req.user.birth = birth;

	req.user.save();

	res.redirect('/users/show_profile');
});

router.get('/edit_like', routerHelper.checkUserLoggedIn, function(req, res){
	Region.find().lean().exec(function(err, regions) {
		res.render('users/edit_like', { regions: regions });
	});
});

router.post('/update_like', routerHelper.checkUserLoggedIn, function(req, res) {
	User.update({ _id: req.user._id}, { additionalInfo: {  like_genres: req.body["like_genres[]"], like_regions: req.body["like_regions[]"], wellknown_regions: req.body["wellknown_regions[]"], visited_regions: req.body["visited_regions[]"] }}, function(err) {
		if (err) {
			console.log(err);
			throw err;
		}

		res.redirect('/users/show_profile');
	});
//	req.user.additionalInfo.wellknownRegion = req.body.wellknownRegion;
//	req.user.additionalInfo.visitedRegion = req.body.visitedRegion;
});

module.exports = router;
