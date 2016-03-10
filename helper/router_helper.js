var querystring = require('querystring');

var routerHelper = {};

routerHelper.checkUserLoggedIn = function (req, res, next) {
	if (req.user) {
		next();
		return;
	}

	var query = querystring.stringify({ redirect_url: req.originalUrl });
	res.redirect('/login?' + query);
	return;
};

routerHelper.tryUseRedirectUrl = function (req, default_redirect_url) {
	if (req.query.redirect_url && isValidRedirection(req.query.redirect_url)) {
		return req.query.redirect_url;
	}

	return default_redirect_url;
};

function isValidRedirection(redirect_url) {
	//not implemented 
	return true;
}

module.exports = routerHelper;
