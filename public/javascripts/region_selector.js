(function($) {
	var RegionSelector = function(options) {
		var self = this;
		self.selectedRegions = [];

		var defaultOption = {};
		self.options = $.extend({}, defaultOption, options);
	};

	RegionSelector.prototype.init = function($elem) {
		var self = this;

		self.elem = $elem;
		$.ajax({
			url: "/ajax/regions_for_search_dbid",
			type: "GET",
			success: function(res) {
				self.initData(self.elem, res);
			}
		});

		self.wrapper = $('<div class=\"region-selector-wrapper"></div>');
		self.elem.wrap(self.wrapper);

		self.regionsBox = $('<div class=\"regions-box"></div>');
		self.elem.after(self.regionsBox);

		self.hiddenInput = $('<input type="hidden" name="regions" >');
		self.elem.after(self.hiddenInput);
	};

	RegionSelector.prototype.initData = function($elem, data) {
		var self = this;
		$elem.typeahead({
			source: data,
			autoSelect: true,
			afterSelect: function (item) {
				self.addSelectedRegion(item);
			}
		});
		/*
			 .bind('change', function(ev, suggestion) {
			 var current = self.elem.typeahead("getActive");
			 if (current) {
			 if (current.name == self.elem.val()) {
			 self.addSelectedRegion(current);
			 }
			 }
			 });
			 */
	};

	RegionSelector.prototype.addSelectedRegion = function(region) {
		var self = this;

		if (self.selectedRegions.indexOf(region.id) !== -1) return;

		self.selectedRegions.push(region.id);
		self.hiddenInput.val(self.selectedRegions.join(';'));

		var $button = $('<a class="btn btn-default selected-region">' + region.name + '<span class="x-icon">x</span></button>');

		$button.on('click', function() { self.removeSelectedRegion($button, region); });
		self.regionsBox.append($button);

		if (self.options.onAddRegion) {
			self.options.onAddRegion(region);
		}
	};

	RegionSelector.prototype.removeSelectedRegion = function($button, region) {
		var self = this;
		$button.remove();

		var index = self.selectedRegions.indexOf(region.id);
		if (index === -1 ) return;


		self.selectedRegions.splice(index, 1);
		self.hiddenInput.val(self.selectedRegions.join(';'));

		if (self.options.onRemoveRegion) {
			self.options.onRemoveRegion(region);
		}
	};

	$.fn.makeRegionSelector = function (options) {
		var regionSelector = new RegionSelector(options);
		$(this).data('region_selector', regionSelector); 

		regionSelector.init($(this));

		return regionSelector;
	};
}(jQuery));

