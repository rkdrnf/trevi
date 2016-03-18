var router = require('express').Router();
var Region = require('../../models/region.js');
var Board = require('../../models/board.js');

router.get('/', function(req, res, next) {
	Region.find().populate('boards').lean().exec(function (err, regions) {
		Board.find().lean().exec(function (err, boards) {
			res.render('admin/regions/index', { regions: regions, boards: boards });
		});
	});
});

router.post('/create', function(req, res, next) {
	Region.create({ name: req.body.name, url: req.body.url, boards: req.body["boards[]"], promotion_text: req.body.promotion_text, background_image_path: req.body.background_image_path }, function(err) { 
		if (err) {
			console.log(err);
			return handleError(err);
		}
		res.redirect('./');
	});
});

router.get('/edit/:id', function(req, res, next) {
	Region.findOne({ _id: req.params.id }).lean().exec(function(err, region) {
		if (err) {
			console.log(err);
			return handleError(err);
		}

		Board.find().lean().exec(function(err, boards) {
			res.render('admin/regions/edit', { region: region, boards: boards });
		});
	});
});

router.post('/update/:id', function(req, res, next) {
	Region.update({ _id: req.params.id }, { name: req.body.name, url: req.body.url, promotion_text: req.body.promotion_text, boards: req.body["boards[]"], background_image_path: req.body.background_image_path }, function(err) { 
		if (err) { 
			console.log(err);
			return handleError(err);
		}
		res.redirect('../');
	});
});

router.get('/delete/:id', function(req, res, next) {
	Region.remove({ _id: req.params.id }, function(err) {
		res.redirect('../');
	});
});


module.exports = router;
