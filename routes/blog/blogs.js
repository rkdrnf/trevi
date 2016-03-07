var express = require('express');
var router = express.Router();
var UserBlog = require('../../models/user_blog.js');


router.post('/create', function(req, res, next) {
	UserBlog.create({ owner: req.body.owner, url: req.body.url }, function (err) {
		if (err) {
			console.log(err);
			handleError(err);
		}

		res.redirect('./');
	});
});

router.get('/:blog_name', function(req, res, next) {
	res.render('blogs/main');
});


module.exports = router;
