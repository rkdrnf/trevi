var router = require('express').Router();
var Board = require('../../models/board.js');
var Region = require('../../models/region.js');
var RouterHelper = require('../../helper/router_helper.js');

router.get('/', function(req, res, next) {
	var query_condition = {};
	if (req.query.region_id) {
		query_condition.region = req.query.region_id;
	}

	Board.find(query_condition).populate('region').lean().exec(function (err, boards) {
		res.render('admin/boards/index', { boards: boards, board_types: Board.getTypes(), board_names: Board.getUniqueNames() });
	});
});

router.post('/create', function(req, res, next) {
	Board.create({ region: req.body.region, name: req.body.name, type: req.body.type, major: req.body.major, unique_name: req.body.unique_name }, function(err) { 
		if (err) {
			console.log(err);
			return handleError(err);
		}
		res.redirect('./');
	});
});


router.get('/edit/:id', function(req, res, next) {
	Board.findOne({ _id: req.params.id }).populate('region').lean().exec(function(err, board) {
		if (err) {
			console.log(err);
			return handleError(err);
		}

		res.render('admin/boards/edit', { board: board, board_types: Board.getTypes(), board_names: Board.getUniqueNames(), redirect_url: encodeURIComponent(req.query.redirect_url) });

	});
});

router.post('/update/:id', function(req, res, next) {
	Board.update({ _id: req.params.id }, { region: req.body.region, name: req.body.name, type: req.body.type, major: req.body.major, unique_name: req.body.unique_name }, function(err) { 
		if (err) { 
			console.log(err);
			return handleError(err);
		}

		if (req.query.redirect_url)
			res.redirect(req.query.redirect_url);
		else
			res.redirect('../');
	});
});

router.get('/delete/:id', function(req, res, next) {
	Board.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log(err);
			return handleError(err);
		}

		if (req.query.redirect_url)
			res.redirect(req.query.redirect_url);
		else
			res.redirect('../');
	});
});


module.exports = router;
