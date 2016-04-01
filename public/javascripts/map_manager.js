(function($) {
	var MapManager = function(elem, options) {
		this.elem = elem;
		this.options = {
			init_location: {
				zoom: 10,
				latLng: {lat: 1, lng: 1}
			}
		};
		this.options = $.extend({}, this.options, options);

		this.init();
	};

	MapManager.prototype.init = function() {
		var self = this;

		if (self.options.places_data) {
			self.places = processLocalData(self.options.places_data);
		} else {
			self.places = {};
		}
		
		self.initMap(this.options.init_location.zoom, this.options.init_location.latLng);

		self.addPlacesMarker(self.places);

		$(document).on('click', '.marker-info', onClickMarker)
		function onClickMarker(e) {
			alert($(e.target).attr("data-id"));
		}
	}

	MapManager.prototype.initMap = function(zoom, latLng) {
		this.map = new google.maps.Map(this.elem[0], {
			zoom: zoom,
			center: latLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
	}

	function processLocalData(placesData) {
		var result = {};
		placesData.forEach(function(place) {
			result[place._id] = place;
		});

		return result;
	}

	MapManager.prototype.addPlacesMarker = function(places) {
		var self = this;
		Object.keys(places).forEach(function(place_id) {
			var place = places[place_id];
			var marker = addMarker({ lat: place.latitude, lng: place.longitude }, self.map);
			place.marker = marker;

			marker.addListener('click', function() {
				self.showInfoWindow(place);
			});
		});
	}

	function addMarker(location, map) {
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});
		return marker;
	}

	MapManager.prototype.showInfoWindow = function(place_id) {
		var place = this.places[place_id];
		var infowindow = new google.maps.InfoWindow({
			content: "<a class=\"marker-info\" data-id=\"" + place._id + "\"><h3>" + place.name + "</h3></a>"
		});	

		infowindow.open(this.map, place.marker);
	}

	MapManager.prototype.moveToPlace = function (place_id) {
		var place = this.places[place_id];
		var location = { lat: place.latitude, lng: place.longitude };
		this.map.setCenter(location);
		this.map.setZoom(16);
	};

	$.fn.makeMapManager = function (options) {
		var mapManager = new MapManager(this, options);
		$(this).data('map_manager', mapManager);

		return mapManager;
	};
}(jQuery));
