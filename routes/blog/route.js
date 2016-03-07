var express = require('express');
var router = express.Router();
var UserBlog = require('../../models/user_blog.js');
var BlogBoard = require('../../models/blog_board.js');
var BlogRouter = require('./blogs.js');
var BoardRouter = require('./boards.js');

router.param('blog_name', function(req, res, next, value) {
	console.log('blogname: ' + value);
	UserBlog.findOne({ url: value }).lean().exec(function(err, blog) {
		if (err) {
			next(err);
			return;
		}

		if (blog) {
			req.blog = blog;
			res.locals.blog = blog;
			next();
			return;
		}

		next();
	});
});

router.param('board_id', function(req, res, next, value) {
	BlogBoard.findOne({ _id: value }).lean().exec(function(err, board) {
		if (err) {
			next(err);
			return;
		}

		if (board) {
			req.board = board;
			req.locals.board = board;
			next();
			return;
		}

		next(new Error('failed to load BlogBoard'));
	});
});

router.use('/', BlogRouter);
router.use('/:blog_name', BoardRouter);



module.exports = router;
