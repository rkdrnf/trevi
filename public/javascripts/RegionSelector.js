(function($) {
	var RegionSelector = function() {};

	RegionSelector.prototype.init = function($elem, options) {
		var self = this;
		self.elem = $elem;
		$.ajax({
			url: "/regions/ajax_regions_for_search",
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
		console.log(self.wrapper);
	}

	RegionSelector.prototype.initData = function($elem, data) {
		var self = this;
		$elem.typeahead({
			source: data,
			autoSelect: true,
		}).bind('change', function(ev, suggestion) {
			var current = self.elem.typeahead("getActive");
			if (current) {
				if (current.name == self.elem.val()) {
					self.addSelectedRegion(current);
				}
			}
		});
	}

	RegionSelector.prototype.addSelectedRegion = function(region) {
		var self = this;
		var $button = $('<button class="btn btn-default selected-region"></button>');
		$button.text(region.name);

		$button.on('click', function() { self.removeSelectedRegion($button, region) });
		self.regionsBox.append($button);

		var regionVal = self.getSelectedRegions();
		regionVal.push(region.id);
		self.hiddenInput.val(regionVal.join(';'));
	};

	RegionSelector.prototype.removeSelectedRegion = function($button, region) {
		var self = this;
		$button.remove();

		var regionVal = self.getSelectedRegions();
		var index = regionVal.indexOf(region.id);
		if (index != -1 ){
			regionVal.splice(index, 1);
		}

		self.hiddenInput.val(regionVal.join(';'));
	};

	RegionSelector.prototype.getSelectedRegions = function() {
		return this.hiddenInput.val().trim().split(';').filter(function(id) { return id.length > 0; });
	};

	$.fn.makeRegionSelector = function (options) {
		var regionSelector = new RegionSelector(options);
		$(this).data('region_selector', regionSelector); 

		regionSelector.init($(this), options);

		return regionSelector;
	};
}(jQuery));

