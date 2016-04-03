var router = require('express').Router();
var Comment = require('../../models/comment.js');
var User = require('../../models/user.js');

router.get('/', function(req, res) {
	var query_condition = {};
	if (req.query.place_id) {
		query_condition.place = req.query.place_id;
	}

	Comment.find(query_condition).populate('author article place photo_article').lean().exec(function (err, comments) {
		comments.forEach(function(com) {
			com.author.name = User.getName(com.author);
		});
		res.render('admin/comments/index', { comments: comments });
	});

});

module.exports = router;

