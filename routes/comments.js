var express = require('express');
var router = express.Router();
var RouterHelper = require('../helper/router_helper.js');
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');

router.post('/create', RouterHelper.checkUserLoggedIn, function(req, res) {
	Article.findById(req.body.article, function(err, article) {
		var comment = new Comment({
			author: req.user._id,
			article: req.body.article,
			content: req.body.content
		});

		article.comments.push(comment);
		article.save(function (err) {
			res.redirect('/articles/' + req.body.article + '#' + comment._id);
		});
	});
});

module.exports = router;
