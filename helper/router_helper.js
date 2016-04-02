var querystring = require('querystring');
var serverConfig = require('../config/server_config.js');

var routerHelper = {};
var User = require('../models/user.js');
var Place = require('../models/place.js');
var Article = require('../models/article.js');
var Board = require('../models/board.js');
var Region = require('../models/region.js');
var Tag = require('../models/tag.js');

routerHelper.checkUserLoggedIn = function (req, res, next) {
	if (req.user) {
		next();
		return;
	}

	if (serverConfig.debug_mode) {
		User.findOne({ 'local.email': serverConfig.debug.test_account }).populate('profile_photo').exec(function(err, user) {
			if (user) {
				req.login(user, function(err) {
					if (!err) {
						res.locals.user = req.user;
						next();
						return;
					}
					else {
						sendUserLoginPage(req, res);
						return;
					}
				});
			} else {
				sendUserLoginPage(req, res);
				return;
			}
		});

		return;
	}

	sendUserLoginPage(req, res);
};

routerHelper.checkUserLoggedInAjax = function (errorCallback) {
	if (!errorCallback) { 
		throw new Error('errorCallback not specified!');
	}

	return function(req, res, next) {
		if (req.user) {
			next();
			return;
		}
		else {
			errorCallback(req, res);
		}
	};
};


function sendUserLoginPage(req, res) {
	if (req.method !== 'GET') {
		res.redirect('/login?' + querystring.stringify({after_login: req.headers.referer }));
		return;
	}

	res.redirect('/login?' + querystring.stringify({after_login: req.originalUrl}));
	return;

}

routerHelper.tryUseRedirectUrl = function (redirect_url, default_redirect_url) {
	if (redirect_url && this.isValidURLPath(redirect_url)) {
		console.log('########');
		console.log(redirect_url);
		return redirect_url;
	}

	return default_redirect_url;
};

routerHelper.isValidURLPath = function(redirect_url) {
	var pattern = /\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
	return redirect_url.length > 0 && pattern.test(redirect_url);
};

routerHelper.setRecPlaces = function(options) {
		return function (req, res, next) { 
			var query = {};
				if (!_.isEmpty(req.query.regions)) {
					query.region = { $in: req.query.regions };
				}

			Place.find(query).lean().limit(3).exec(function(err, rec_places) {
				if (err) {
					throw err;
				}

				res.locals.recommended_places = rec_places;
				next();
			});
	};
};

routerHelper.setRecArticles = function(options) {
	var query = {};

	return function(req, res, next) {
		Article.find(query).lean().limit(3).exec(function(err, rec_articles) {
			if (err) {
				throw err;
			}

			res.locals.recommended_articles = rec_articles;
			next();
		});
	};
};

routerHelper.setRecQuestions = function(options) {
	var query = {};

	return function(req, res, next) {
		Article.find(query).lean().limit(3).exec(function(err, rec_questions) {
			if (err) throw err;

			res.locals.recommended_questions = rec_questions;
			next();
		});
	};
};

routerHelper.getAllRegions = function(selects) {
	return function(req, res, next) {
		Region.find().select(selects).lean().exec(function(err, regions) {
			if(err)
				throw err;

			res.locals.all_regions = regions;
			next();
		});
	};
};

routerHelper.getAllBoards = function(selects) {
	return function(req, res, next) {
		Board.find().select(selects).lean().exec(function(err, boards) {
			if (err)
				throw err;

			res.locals.all_boards = boards;
			next();
		});
	};
};

routerHelper.processTags = function(tagGetter) {
	return function(req, res, next) {
		var tags = tagGetter(req).map(function(tag) { return tag.trim(); }).filter(function(tag) { return tag.length > 0; });
		req.tags = Tag.createOrUpdate(tags);
		next();
	};
};

module.exports = routerHelper;
