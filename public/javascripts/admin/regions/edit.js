
var map;

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var city = "korea";

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: -34.397, lng: 150.644},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	var geocoder = new google.maps.Geocoder();

//	document.getElementById('submit').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
//	});
	
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});
}

function geocodeAddress(geocoder, resultsMap) {
	var address = city;
		//document.getElementById('address').value;
	console.log(address);
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function addMarker(location, map) {
	$('#lngValue').val(location.lng());
	$('#latValue').val(location.lat());
	$('#zoomLevel').val(map.getZoom());
	var marker = new google.maps.Marker({
		position: location,
		label: labels[labelIndex++ % labels.length],
		map: map
	});
	
}


