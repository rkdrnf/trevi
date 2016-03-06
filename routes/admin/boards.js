var router = require('express').Router();
var Board = require('../../models/board.js');
var Region = require('../../models/region.js');

router.get('/', function(req, res, next) {
	Region.find().lean().exec(function (err, regions) {
		Board.find().populate('region').lean().exec(function (err, boards) {
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

			res.render('admin/boards/edit', { board: board, regions: regions });

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
		res.redirect('../');
	});
});

router.get('/delete/:id', function(req, res, next) {
	Board.remove({ _id: req.params.id }, function(err) {
		res.redirect('../');
	});
});


module.exports = router;
