var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/images/user_images/'});
var MAU = require('../helper/modify_and_upload.js');
var Photo = require('../models/photo.js');
var RouterHelper = require('../helper/router_helper.js');

router.post('/', upload.fields([{ name: 'image' }, { name: 'images[]' }]), function(req, res, next) {
	var mau = new MAU(req.files["images[]"], {}, function(err, result){
		if(err) { res.json({ error: true }); }
		else {
			var values = result.files.map(function(fileInfo) {
				return {
					path: Photo.getImagePath('Article') + fileInfo.filename,
					thumbnail: Photo.getThumbnailPath('Article') + fileInfo.thumbnailName,
					owner: req.user._id
				};
			});

			Photo.create(values, function(err, photos) {
				if (err) { res.json({ error: true}); }
				else {
					photos.forEach(function(photo, i) {
						result.files[i].id = photo._id;
					});
					res.json(result);
				}
			});
		}
	});
});


module.exports = router;
