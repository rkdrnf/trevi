
var map;

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: local_data.place.latitude, lng: local_data.place.longitude},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	addMarker({ lat: local_data.place.latitude, lng: local_data.place.longitude }, map);

//	document.getElementById('submit').addEventListener('click', function() {
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
/*	var infoWindow = new google.maps.InfoWindow({
		content: '<p>Marker Location:' + marker.getPosition() + '</p>'
	});
*/

function addMarker(location, map) {
	var marker = new google.maps.Marker({
		position: location,
		label: labels[labelIndex++ % labels.length],
		map: map
	});
	
}

/*
서울시       : 37.540705, 126.956764
인천광역시 : 37.469221, 126.573234
광주광역시 : 35.126033, 126.831302
대구광역시 : 35.798838, 128.583052
울산광역시 : 35.519301, 129.239078
대전광역시 : 36.321655, 127.378953
부산광역시 : 35.198362, 129.053922
경기도       : 37.567167, 127.190292
강원도       : 37.555837, 128.209315
충청남도    : 36.557229, 126.779757
충청북도    : 36.628503, 127.929344
경상북도    : 36.248647, 128.664734
경상남도    : 35.259787, 128.664734
전라북도    : 35.716705, 127.144185
전라남도    : 34.819400, 126.893113
제주도       : 33.364805, 126.542671
*/
//*******************current position********************

/*	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			map.setCenter(pos);
		}, function(){
			handleLocationError(false, infoWindow, map.getCenter());
		});
	} else {
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos){
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
												'Error: The Geolocation service failed.' :										                        'Error: Your browser doesn\'t support geolocation.');
}
*/
