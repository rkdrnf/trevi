function initMap() {
	var mapManager = $('#map').makeMapManager({
		places_data: local_data.places,
		init_location: {
			zoom: local_data.location.zoomLevel,
			latLng: { lat: local_data.location.latitude, lng: local_data.location.longitude },
		}
	});

	$(document).on('click', '.place-button', { mapManager: mapManager }, onClickPlaceButton);

	function onClickPlaceButton(e) {
		var placeId = $(this).attr('data-id');
		var mapManager = e.data.mapManager;

		mapManager.moveToPlace(placeId);
		mapManager.showInfoWindow(placeId);
	}
}

$(function() {
	angular.module('google-map', ['uiGmapgoogle-maps'])
.controller('googleMapController', ['$scope', function($scope) {
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
}]);
});
