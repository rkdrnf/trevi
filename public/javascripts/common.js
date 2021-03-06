Date.prototype.prettify = function ()
{
	return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + formatAMPM(this);
};


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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

