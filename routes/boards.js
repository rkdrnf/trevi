var express = require('express');
var router = express.Router();
var Board = require('../models/board.js');
var url = require('url');

var qc =  require('../helper/query_checker.js');
var queryChecker = new qc();
var ObjectId = require('mongoose').Types.ObjectId;

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




queryChecker.add("board_id", [
	{
		name: "region",
		required: false,
		type: ObjectId,
		handler: function(query, region) {
			if (!query.regions) {
				query.regions = [region];
			}
		}
	},
	{
		name: "regions",
		required: false,
		type: Array,
		handler: function(query, regions) {
			if (regions.length == 1) {
				query.region = regions[0];
			}
		}
	}
]);

router.get('/:board_id', queryChecker.check("board_id"), function(req, res) {
	var query = url.parse(req.url, true).query;

	query["boards[]"] = [req.board._id.toString()];

	console.log(query);

	var newUrlObj = {
		pathname: "/articles",
		query: query
	};

	res.redirect(url.format(newUrlObj));
});


module.exports = router;

