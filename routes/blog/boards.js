var express = require('express');
var router = express.Router();
var BlogBoard = require('../../models/blog_board.js');

router.get('/:board_id', function(req, res, next) {
	res.render('blogs/board_' + req.board.type);
});

module.exports = router;
