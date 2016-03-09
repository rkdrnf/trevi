var jadeHelper = {};

jadeHelper.tryDefaultImage = function (imagePath, defaultImagePath) {
	if (!imagePath || imagePath.length == 0)
		return defaultImagePath;

	return imagePath;
}


jadeHelper.encodeURI = function(uri) {
	return encodeURIComponent(uri);
};


module.exports = jadeHelper;
