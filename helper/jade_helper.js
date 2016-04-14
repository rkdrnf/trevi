var querystring = require('querystring');
var qs = require('qs'); 
var jadeHelper = {};
var User = require('../models/user.js');

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

jadeHelper.includesIdIn = function(ids, id) {
	if (!ids) return false;

	var idStr = id.toString();
	for (var i = 0; i < ids.length; i++) {
		if (ids[i].toString() === idStr) {
			return true;
		}
	}
	return false;
};

jadeHelper.compareId = function(id_a, id_b) {
	return id_a.toString() === id_b.toString();
};

jadeHelper.getTextLines = function(body) {
	return body.split('\n');
};

jadeHelper.user = {
	getName: function(user) {
		return User.getName(user);
	},
	getEmail: function(user) {
		return User.getEmail(user);
	}
};

jadeHelper.dummyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lectus ligula, egestas vel finibus non, hendrerit at metus. Proin ut est urna. In imperdiet mauris at accumsan condimentum. Vestibulum elementum ultrices commodo. Nullam consequat id purus in blandit. Mauris tincidunt, sem vel placerat fermentum, nunc urna dignissim enim, bibendum hendrerit purus tortor sit amet mi. Vivamus vel nunc nec nulla aliquet viverra. Fusce viverra velit eu sem aliquam, et feugiat enim luctus. Sed in fermentum purus. Aliquam eget enim eu ligula aliquam fringilla at at nulla. Phasellus interdum, enim nec lacinia pulvinar, dolor purus aliquam arcu, id efficitur tellus libero sed augue. Mauris a felis ac ante euismod elementum ut a sapien.';

module.exports = jadeHelper;
