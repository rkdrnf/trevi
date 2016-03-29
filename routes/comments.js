var express = require('express');
var router = express.Router();
var RouterHelper = require('../helper/router_helper.js');
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');

router.post('/create', RouterHelper.checkUserLoggedIn, function(req, res) {
	Comment.create({ author: req.user._id, article: req.body.article, content: req.body.content }, function(err, comment) {
		if (err) {
			console.log(err);
			res.redirect('/articles/' + req.body.article);
		} else {
			Article.update({ _id: req.body.article }, { $addToSet: { comments: comment._id }}, function(err, affected) {
				if (err) {
					console.log(err);
					res.redirect('/articles/' + req.body.article);
				} else {
					res.redirect('/articles/' + req.body.article + '#' + comment._id);
				}
			});
		}
	});
});

router.post('/addStar', RouterHelper.checkUserLoggedInAjax(function(req, res) {
	res.json({ error: "먼저 로그인해주세요" });
}), function(req, res, next) {
	console.log(req.body.id);
	Comment.addStar(req.user, req.body.id, function(err) {
		if (err) 
			res.json({ error: "이미 추천한 게시물입니다."});
		else {
			res.json({});
		}
	});
});


module.exports = router;
