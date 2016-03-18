
var map;

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


function initMap() {
	var pos = {lat: 37.397, lng: 128.644};
	
	map = new google.maps.Map(
		document.getElementById('map'), 
		{
			center: pos,
			zoom: 10
		}
	);

/*	var infoWindow = new google.maps.InfoWindow({
		content: '<p>Marker Location:' + marker.getPosition() + '</p>'
	});
*/
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});
}

function addMarker(location, map) {
	$('#lngValue').val(location.lng());
	$('#latValue').val(location.lat());
	var marker = new google.maps.Marker({
		position: location,
		label: labels[labelIndex++ % labels.length],
		map: map
	});
	
}



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
