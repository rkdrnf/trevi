var router = require('express').Router();
var RouterHelper = require('../../helper/router_helper.js');
var PhotoArticle = require('../../models/photo_article.js');

router.get('/', function(req, res) {
	var query_condition = {};
	if (req.query.region_id) {
		query_condition.region = req.query.region_id;
	}

	PhotoArticle.find(query_condition).populate('author region photo').lean().exec(function (err, articles) {
		res.render('admin/photo_articles/index', { articles: articles });
	});
});

router.get('/delete/:id', function(req, res) {
	PhotoArticle.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log(err);
			throw err;
		}

		res.redirect(RouterHelper.tryUseRedirectUrl(req.query.redirect_url, 'back'));
	});
});

module.exports = router;
