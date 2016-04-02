var express = require('express');
var router = express.Router();
var RouterHelper = require('../helper/router_helper.js');
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var url = require('url');
var Place = require('../models/place.js');
var PhotoArticle = require('../models/photo_article.js');

router.post('/create', RouterHelper.checkUserLoggedIn, function(req, res) {
	Comment.create({ author: req.user._id, article: req.body.article, content: req.body.content }, function(err, comment) {
		if (err) {
			console.log(err);
			res.redirect(RouterHelper.tryUseRedirectUrl(req.query.redirect_url, 'back'));
		} else {
			Article.update({ _id: req.body.article }, { $addToSet: { comments: comment._id }}, function(err) {
				if (err) {
					console.log(err);
					res.redirect(RouterHelper.tryUseRedirectUrl(req.query.redirect_url, 'back'));
				} else {
					var newRdr = url.parse(req.query.redirect_url);
					newRdr.hash = comment._id.toString();

					res.redirect(RouterHelper.tryUseRedirectUrl(url.format(newRdr), 'back'));
				}
			});
		}
	});
});

router.post('/create_photo', RouterHelper.checkUserLoggedIn, function(req, res) {
	Comment.create({ author: req.user._id, photo_article: req.body.photo_article, content: req.body.content }, function(err, comment) {
		if (err) {
			console.log(err);
			res.redirect(RouterHelper.tryUseRedirectUrl(req.query.redirect_url, 'back'));
		} else {
			PhotoArticle.update({ _id: req.body.photo_article }, { $addToSet: { comments: comment._id }}, function(err) {
				if (err) {
					console.log(err);
					res.redirect(RouterHelper.tryUseRedirectUrl(req.query.redirect_url, 'back'));
				} else {
					var newRdr = url.parse(req.query.redirect_url);
					newRdr.hash = comment._id.toString();

					res.redirect(RouterHelper.tryUseRedirectUrl(url.format(newRdr), 'back'));
				}
			});
		}
	});
});


router.post('/create_place_ajax', RouterHelper.checkUserLoggedInAjax(function(req, res) {
	res.json({ error: "먼저 로그인해주세요"});
}), function(req, res) {
	console.log('arrived');
	Comment.create({ author: req.user._id, place: req.body.place, content: req.body.content }, function(err, comment) {
		if (err) {
			console.log(err);
			res.json({ error: err });
			return;
		}

		Place.update({ _id: req.body.place }, { $addToSet: { comments: comment._id }}, function(err) {
			if(err) {
				console.log(err);
				res.json({ error: err });
				return;
			}

			res.json({ newComment: comment });
		});
	});
});


router.post('/addStar', RouterHelper.checkUserLoggedInAjax(function(req, res) {
	res.json({ error: "먼저 로그인해주세요" });
}), function(req, res) {
	console.log(req.body.id);
	Comment.addStar(req.user, req.body.id, function(err) {
		if (err) 
			res.json({ error: "이미 추천한 게시물입니다."});
		else {
			res.json({});
		}
	});
});


router.post('/addStar', RouterHelper.checkUserLoggedInAjax(function(req, res) {
	res.json({ error: "먼저 로그인해주세요" });
}), function(req, res) {
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
