var jadeHelper = {};

jadeHelper.tryDefaultImage = function (imagePath, defaultImagePath) {
	if (!imagePath || imagePath.length == 0)
		return defaultImagePath;

	return imagePath;
}

module.exports = jadeHelper;
