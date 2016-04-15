/* globals Bloodhound */
(function($) {
	var RegionSelector = function(options) {
		var self = this;

		var defaultOption = {};
		self.options = $.extend({}, defaultOption, options);
		self.data = options.data;

		self.regions = options.regions;
	};

	RegionSelector.prototype.init = function($elem) {
		var self = this;

		self.elem = $elem;

		var regionHound = new Bloodhound({
			name: "regions",
			local: self.regions,
			identify: function(d) { return d._id; },
			datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.name); },
			queryTokenizer: Bloodhound.tokenizers.whitespace
		});

		regionHound.initialize();

		var ta = $('.region-select').typeahead({
			highlight: true
		}, {
			displayKey: "name",
			limit: 10,
			source: regionHound.ttAdapter(),
		}).bind('typeahead:select', function(ev, suggestion) {
			self.addSelectedRegion(suggestion);
			ta.typeahead("close").typeahead('val', '');
		});
		
		ta.bind('typeahead:autocomplete', function(ev, suggestion){
			self.addSelectedRegion(suggestion);
			ta.typeahead("close").typeahead('val', '');
		});
		ta.bind('enterKey', function() {
			var e = jQuery.Event("keydown");
			e.which = 9; // # Some key code value
			$(this).trigger(e);
		});
	};

	RegionSelector.prototype.addSelectedRegion = function(region) {
		var self = this;

		if (self.data.selected.find(function(r) { return r._id === region._id; })) return;

		self.data.selected.push(region);

		if (self.options.onAddRegion) {
			self.options.onAddRegion(region);
		}
	};

	$.fn.makeRegionSelector = function (options) {
		var regionSelector = new RegionSelector(options);
		$(this).data('region_selector', regionSelector); 

		regionSelector.init($(this));

		return regionSelector;
	};
}(jQuery));

