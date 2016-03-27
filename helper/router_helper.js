var querystring = require('querystring');
var serverConfig = require('../config/server_config.js');

var routerHelper = {};
var User = require('../models/user.js');
var Place = require('../models/place.js');
var Article = require('../models/article.js');

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

function sendUserLoginPage(req, res) {
	if (req.method !== 'GET') {
		res.redirect('/login?' + querystring.stringify({after_login: req.headers.referer }));
		return;
	}

	res.redirect('/login?' + querystring.stringify({after_login: req.originalUrl}));
	return;

}

routerHelper.tryUseRedirectUrl = function (req, default_redirect_url) {
	if (req.query.redirect_url && this.isValidURLPath(req.query.redirect_url)) {
		return req.query.redirect_url;
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

			Place.find(query).lean().exec(function(err, rec_places) {
				if (err) {
					throw err;
				}
				req.rec_places = rec_places;
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
			req.rec_articles = rec_articles;
			next();
		});
	};
};

module.exports = routerHelper;
