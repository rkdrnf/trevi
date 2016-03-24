var querystring = require('querystring');
var qs = require('qs');
var jadeHelper = {};

Date.prototype.prettify = function ()
{
	return this.getFullYear() + '-' + this.getMonth() + '-' + this.getDay() + ' ' + formatAMPM(this);
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

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

jadeHelper.dummyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lectus ligula, egestas vel finibus non, hendrerit at metus. Proin ut est urna. In imperdiet mauris at accumsan condimentum. Vestibulum elementum ultrices commodo. Nullam consequat id purus in blandit. Mauris tincidunt, sem vel placerat fermentum, nunc urna dignissim enim, bibendum hendrerit purus tortor sit amet mi. Vivamus vel nunc nec nulla aliquet viverra. Fusce viverra velit eu sem aliquam, et feugiat enim luctus. Sed in fermentum purus. Aliquam eget enim eu ligula aliquam fringilla at at nulla. Phasellus interdum, enim nec lacinia pulvinar, dolor purus aliquam arcu, id efficitur tellus libero sed augue. Mauris a felis ac ante euismod elementum ut a sapien.'

module.exports = jadeHelper;
