var map;
var data;

function initMap() {
	data = processLocalData(local_data);
	function processLocalData(localData) {
		var result = {};
		localData.places.forEach(function(place) {
			result[place._id] = place;
		});

		return result;
	}


	map = new google.maps.Map(document.getElementById('map'), {
		zoom: local_data.location.zoomLevel,
		center: {lat: local_data.location.latitude, lng: local_data.location.longitude},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	local_data.places.forEach(function(place) {
		var marker = addMarker({ lat: place.latitude, lng: place.longitude }, map);
		data[place._id].marker = marker;

		marker.addListener('click', function() {
			showInfoWindow(place);
		});
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
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});

	return marker;
}

function showInfoWindow(place) {
		var infowindow = new google.maps.InfoWindow({
			content: "<a class=\"marker-info\" data-id=\"" + place._id + "\"><h3>" + place.name + "</h3></a>"
		});	

		infowindow.open(map, place.marker);
}




$(function() {
	
	$(document).on('click', '.place-button', onClickPlaceButton);

	$(document).on('click', '.marker-info', onClickMarker)

	function onClickMarker(e) {
		alert($(e.target).attr("data-id"));
	}


	function onClickPlaceButton() {
		var placeId = $(this).attr('data-id');

		moveToPlace(data[placeId]);
		showInfoWindow(data[placeId]);
	}

	

	
	function moveToPlace(place) {
		var location = { lat: place.latitude, lng: place.longitude };
		map.setCenter(location);
		map.setZoom(16);
//		var marker = new google.maps.Marker({
//			map: map,
//			position: location
//		});
	}

});
