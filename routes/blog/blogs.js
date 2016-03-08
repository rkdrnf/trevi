var express = require('express');
var router = express.Router();
var UserBlog = require('../../models/user_blog.js');
var routerHelper = require('../../helper/router_helper.js');
var BoardRouter = require('./boards.js');

router.param('blog_name', function(req, res, next, value) {
	UserBlog.findOne({ url: value }).lean().exec(function(err, blog) {
		if (err) {
			next(err);
			return;
		}

		if (blog) {
			req.blog = blog;
			res.locals.blog = blog;
			next();
			return; }

		next();
	});
});

router.use(setMyBlog);

router.post('/create', routerHelper.checkUserLoggedIn, function(req, res, next) {
	var url = UserBlog.createUrl(req.user);
	if (!url) res.render(500);
	console.log(url);
	UserBlog.create({ owner: req.user, url: url }, function (err) {
		if (err) {
			console.log(err);
			handleError(err);
		}

		res.redirect(url);
	});
});

router.get('/', function(req, res, next) {
	res.redirect('main');
});

router.get('/main', function(req, res, next) {
	UserBlog.find().populate('owner').lean().exec(function (err, blogs) {
		if (err) {
			console.log(err);
			handleError(err);
		}
		res.render('blogs/main', { blogs: blogs });
	});
});

router.get('/new', function(req, res, next) {
	res.redirect('main');
});

router.get('/:blog_name', checkBlogExists, function(req, res, next) {
	res.render('blogs/individual');
});

function checkBlogExists(req, res, next) {
	if (req.blog) {
		next();
		return;
	} 
	
	res.render('notfound');
}


router.use('/:blog_name', BoardRouter);


function setMyBlog(req, res, next) {
	if (req.user) {

		UserBlog.findOne({ owner: req.user._id }).lean().exec(function(err, blog) {
			req.my_blog = blog;
			res.locals.my_blog = blog;
			next();
		});
		return;
	}

	next();
}

module.exports = router;
