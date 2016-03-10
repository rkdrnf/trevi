var querystring = require('querystring');

var routerHelper = {};

routerHelper.checkUserLoggedIn = function (req, res, next) {
	if (req.user) {
		next();
		return;
	}
	
	if (req.method !== 'GET') {
		res.redirect('/login?' + querystring.stringify({after_login: req.headers.referer }));
		return;
	}
	
	res.redirect('/login?' + querystring.stringify({after_login: req.originalUrl}));
	return;
};

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

module.exports = routerHelper;
