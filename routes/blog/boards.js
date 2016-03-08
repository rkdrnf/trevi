var express = require('express');
var router = express.Router();
var BlogBoard = require('../../models/blog_board.js');

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


router.get('/:board_id', function(req, res, next) {
	res.render('blogs/board_' + req.board.type);
});

module.exports = router;
