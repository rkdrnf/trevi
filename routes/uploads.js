var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/images/user_images/'});
var processImages = require('../helper/modify_and_upload.js');
var Photo = require('../models/photo.js');
var RouterHelper = require('../helper/router_helper.js');

router.post('/', upload.fields([{ name: 'image' }, { name: 'images[]' }]), processImages(function(req) { return req.files["images[]"]; }, { type: 'Article', saves: 'thumbnail' }), function(req, res) {
	var values = req.processedImages.files.map(function(fileInfo) {
		return {
			original: fileInfo.original,
			thumbnail: fileInfo.thumbnail,
			owner: req.user._id
		};
	});

	Photo.create(values, function(err, photos) {
		if (err) { res.json({ error: true}); }
		else {
			photos.forEach(function(photo, i) {
				values[i].id = photo._id;
			});
			res.json(values);
		}
	});
});


module.exports = router;
