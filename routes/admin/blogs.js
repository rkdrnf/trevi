var router = require('express').Router();
var UserBlog = require('../../models/user_blog.js');

router.get('/', function(req, res, next) {
	UserBlog.find().lean().exec(function (err, blogs) {
		res.render('admin/blogs/index', { blogs: blogs });
	});
});


router.get('/delete/:id', function (req, res, next) {
	UserBlog.remove({ _id: req.params.id }, function(err) {
		res.redirect('../');
	});
});

module.exports = router;


