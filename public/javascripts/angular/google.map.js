(function() {
	var mapModule = angular.module('google.map', ['uiGmapgoogle-maps', 'place.modal']);
	mapModule.controller('googleMapController', ['$scope', '$window', function($scope, $window) {

		function processMapLocation(location) {
			return { 
				center: { latitude: location.latitude, longitude: location.longitude},
				zoom: location.zoomLevel
			};
		}

		function processLocalData(placesData) {
			var i = 0;
			placesData.forEach(function(place) {
				place.id = i;
				place.location = { latitude: place.latitude, longitude: place.longitude };
				place.show = false;
				i++;
			});

			return placesData;
		}

		$scope.initialize = function(mapData) {
			$scope.map = processMapLocation(mapData.location);
			$scope.places = processLocalData(mapData.places);
		};

		$scope.onClickMarker = function(marker, eventName, place) {
			$scope.infoWindow = place;
			$scope.infoWindow.show = true;
		};

		$scope.onClickPlaceButton = function(place) {
			$scope.map.center = $.extend({}, place.location);
			$scope.map.zoom = 16;
			$scope.infoWindow = place;
			$scope.infoWindow.show = true;
		};

		$scope.onCloseInfoWindow = function() {
			$scope.infoWindow.show = false;
		};

		$scope.initialize($window.local_data);
	}]);

	mapModule.controller('infoWindowController', ['$scope', '$timeout', 'PlaceModalOpener', function($scope, $timeout,PlaceModalOpener) {
		$scope.open = function(place) {
			PlaceModalOpener(place);
		};

		$scope.makeRaty = function() {
			var defaultPath = "/bower_components/raty/lib/images/";
			$timeout(function() {
				var target = $('.star-rating');
				if (target.length === 0) {
					console.log('no target');
				}
				target.raty({
					starHalf    : defaultPath + 'star-half.png',
					starOff     : defaultPath + 'star-off.png',
					starOn      : defaultPath + 'star-on.png' 
				});
			}, 0, false);
		};

		$scope.load = function() {
		};
	}]);
})();

