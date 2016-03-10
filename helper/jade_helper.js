var querystring = require('querystring');
var jadeHelper = {};

jadeHelper.tryDefaultImage = function (imagePath, defaultImagePath) {
	if (!imagePath || imagePath.length === 0)
		return defaultImagePath;

	return imagePath;
};


jadeHelper.encodeURI = function(uri) {
	return encodeURIComponent(uri);
};

jadeHelper.addRedirection = function(url, redirect_url) {
	return url + '?' + querystring.stringify({redirect_url: redirect_url});
};


module.exports = jadeHelper;
