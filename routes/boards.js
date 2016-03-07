var express = require('express');
var router = express.Router();
var Board = require('../models/board.js');
var Article = require('../models/article.js');

router.param('board_id', function(req, res, next, value) {
	Board.findOne({ _id: value }).lean().exec(function(err, board) {
		if (err) {
			next(err);
			return;
		}

		if (board) {
			req.board = board;
			next();
			return;
		}

		next(new Error('failed to load Board'));
	});
});

router.get('/:board_id', function(req, res, next) {
	Article.find().lean().exec(function(err, articles) {
		res.render('boards/main', { board: req.board, articles: articles });
	});
});


module.exports = router;

