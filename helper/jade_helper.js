var querystring = require('querystring');
var qs = require('qs');
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

jadeHelper.buildQuery = function(queryObj) {
	return querystring.stringify(queryObj);
};

jadeHelper.buildGetQuery = function(queryObj) {
	return qs.stringify(queryObj);
};


//{ key: val, key, val }

module.exports = jadeHelper;
