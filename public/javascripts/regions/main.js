var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: local_data.location.zoomLevel,
		center: {lat: local_data.location.latitude, lng: local_data.location.longitude},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow({
		content: "hihihi"
	});	

	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});

	
}

function geocodeAddress(geocoder, resultsMap) {
	var address = city;
		//document.getElementById('address').value;
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
	$('#lngValue').val(location.lng());
	$('#latValue').val(location.lat());
	var marker = new google.maps.Marker({
		position: location,
		label: labels[labelIndex++ % labels.length],
		map: map
	});
	
	return marker;
}

$(function() {
	var data = processLocalData(local_data);
	
	$(document).on('click', '.place-button', onClickPlaceButton);

	function onClickPlaceButton() {
		var placeId = $(this).attr('data-id');

		moveToPlace(data[placeId]);
	}


	function processLocalData(localData) {
		var result = {};
		localData.places.forEach(function(place) {
			result[place._id] = place;
		});

		return result;
	}

	function moveToPlace(place) {
		var location = { lat: place.latitude, lng: place.longitude };
		map.setCenter(location);
		map.setZoom(16);
		var marker = new google.maps.Marker({
			map: map,
			position: location
		});
	}

});
