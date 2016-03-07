var router = require('express').Router();
var BlogBoard = require('../../models/blog_board.js');

router.get('/', function(req, res, next) {
	BlogBoard.find().lean().exec(function (err, boards) {
		res.render('admin/blog_boards/index', { boards: boards });
	});
});


router.get('/delete/:id', function (req, res, next) {
	BlogBoard.remove({ _id: req.params.id }, function(err) {
		res.redirect('../');
	});
});

module.exports = router;


