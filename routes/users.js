var express = require('express');
var multer = require('multer');
var Region = require('../models/region.js'); 
var router = express.Router();
var routerHelper = require('../helper/router_helper.js');
var upload = multer({ dest: 'public/images/profile_photos/'});
var ProfilePhoto = require('../models/profile_photo.js');
var MAU = require('../helper/modify_and_upload.js');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/edit', routerHelper.checkUserLoggedIn, function(req, res) {
	res.render('users/edit');
});

router.post('/update', routerHelper.checkUserLoggedIn, upload.single('profile_photo'), function(req, res) {
	if (req.file) {
		var mau = new MAU([req.file], {
			save_path: 'public/images/profile_photos/',
			thumbnail_size: { x: 100, y: 100 }
		}, function(err, result) {
			if (err) {
				console.log(err);
			}
			var values = result.files.map(function(fileInfo) {
				return {
					path: ProfilePhoto.userImagePath + fileInfo.filename,
					thumbnail: ProfilePhoto.thumbnailPath + fileInfo.thumbnailName,
					owner: req.user._id
				};
			});

			ProfilePhoto.create(values[0], function(err, photo) {
				if (err) {
					console.log(err);
				}
				req.user.profile_photo = photo._id;
				req.user.save(function (err) {
					if (err) console.log(err);
				});
			});
		});
	}

	req.user.local.name = req.body.name;
	req.user.local.email = req.body.email;
	req.user.sex = req.body.sex;
	var birth = new Date(+req.body.birth_year, +req.body.birth_month - 1, +req.body.birth_date);
	req.user.birth = birth;

	req.user.save();

	res.redirect('back');
});

router.get('/edit_like', routerHelper.checkUserLoggedIn, function(req, res){
	Region.find().lean().exec(function(err, regions) {
		res.render('users/edit_like', { regions: regions });
	});
});

router.post('/update_like', routerHelper.checkUserLoggedIn, function(req, res) {
	User.update({ _id: req.user._id}, { additionalInfo: {  likeGenres: req.body["likeGenres[]"], likeRegions: req.body["likeRegions[]"] }}, function(err) {
		if (err) {
			console.log(err);
			throw err;
		}

		res.redirect('/users/edit');
	});
	req.user.additionalInfo.wellknownRegion = req.body.wellknownRegion;
	req.user.additionalInfo.visitedRegion = req.body.visitedRegion;
});

module.exports = router;
