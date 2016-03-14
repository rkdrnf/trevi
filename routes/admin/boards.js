var router = require('express').Router();
var Board = require('../../models/board.js');
var Region = require('../../models/region.js');

router.get('/', function(req, res, next) {
	var query_condition = {};
	if (req.query.region_id) {
		query_condition.region = req.query.region_id;
	}

	Region.find().lean().exec(function (err, regions) {
		Board.find(query_condition).populate('region').lean().exec(function (err, boards) {
			res.render('admin/boards/index', { boards: boards, regions: regions });
		});
	});
});

router.post('/create', function(req, res, next) {
	var categories = req.body.categories.split(";").map(function(category) { return category.trim(); }).filter(function(category) { return category.length > 0 });

	Board.create({ region: req.body.region, name: req.body.name, categories: categories }, function(err) { 
		if (err) {
			console.log(err);
			return handleError(err);
		}
		res.redirect('./');
	});
});


router.get('/edit/:id', function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		Board.findOne({ _id: req.params.id }).populate('region').lean().exec(function(err, board) {
			if (err) {
				console.log(err);
				return handleError(err);
			}


			res.render('admin/boards/edit', { board: board, regions: regions, redirect_url: encodeURIComponent(req.query.redirect_url) });

		});
	});
});

router.post('/update/:id', function(req, res, next) {
	var categories = req.body.categories.split(';').map(function(cat) { return cat.trim(); }).filter(function(cat) { return cat.length > 0 });
	Board.update({ _id: req.params.id }, { region: req.body.region, name: req.body.name, categories: categories }, function(err) { 
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
