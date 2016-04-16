/* globals Set */
(function($) {

	var BoardSelector = function($elem, options) {
		var self = this;
		
		var defaultOption = {};
		self.options = $.extend({}, defaultOption, options);
		self.selectedRegions = new Set();
		self.currentOptions = new Set();
		self.availableBoards = new Set();
		self.delayedRegions = new Set();
	};

	BoardSelector.prototype.init = function($elem) {
		var self = this;

		self.elem = $elem;
		$.ajax({ 
			url: "/ajax/boards_for_search", 
			type: "GET",
			success: function(res) {
				self.initData(res);
				self.processDelayed();
				self.show();
			}
		});
	};

	BoardSelector.prototype.initData = function(data) {
		var self = this;
		self.regions_pool = {};
		data.regions.forEach(function(region) {
			self.regions_pool[region._id] = region;
		});

		self.boards_pool = {};
		data.boards.forEach(function(board) {
			self.boards_pool[board._id] = board;
		});
	};

	BoardSelector.prototype.selectRegions = function(regions) {
		var self = this;
		if (self.initialized) {
			self.selectedRegions = regions;
			self.show();
		} else {
			self.delayedRegions = regions;
		}
	};

	BoardSelector.prototype.addRegion = function(region) {
		var self = this;
		if (self.initialized) {
			self.selectedRegions.add(region);
			self.show();
		} else {
			self.delayedRegions.add(region);
		}
	};

	BoardSelector.prototype.show = function() {
		var self =this;
		self.RefreshAvailableBoards();
	};

	BoardSelector.prototype.removeRegion = function(region) {
		var self = this;
		if (self.initialized) {
			self.selectedRegions.delete(region);
			self.show();
		} else {
			self.delayedRegions.delete(region);
		}
	};

	BoardSelector.prototype.processDelayed = function() {
		var self = this;

		self.selectedRegions = self.delayedRegions;
		self.RefreshAvailableBoards();
		self.initialized = true;
	};

	BoardSelector.prototype.RefreshAvailableBoards = function() {
		var self = this;
		var original = self.currentOptions;
		var newBoards = new Set();
		self.selectedRegions.forEach(function(region) {
			if (!self.regions_pool[region].boards) return;
			self.regions_pool[region].boards.forEach(function(board) {
				newBoards.add(board.toString());
			});
		});

		var removes = [];
		original.forEach(function(board) {
			if (!newBoards.has(board)) {
				removes.push(board);
			}
		});

		var news = [];
		newBoards.forEach(function(board){
			if (!original.has(board)) {
				news.push(board);
			}
		});
		
		self.showAvailableBoards({ news: news, olds: removes });
	};

	BoardSelector.prototype.showAvailableBoards = function (oldandnew) {
		var self = this;
		if (self.selectedRegions.size === 0) {
			self.clearOption();
			self.addOption('-1', "지역을 먼저 선택해주세요");
		} else {
			oldandnew.olds.forEach(function(board) {
				self.removeOption(board);
			});

			oldandnew.news.forEach(function(board) {
				self.addOption(board, self.boards_pool[board].name);
			});
		}
	};

	BoardSelector.prototype.addOption = function(val, name) {
		var self = this;

		if (self.currentOptions.has(val)) return;

		self.currentOptions.add(val);
		
		var $option = $('<option value="' + val + '">' + name + '</option>');
		self.elem.append($option);
	};

	BoardSelector.prototype.removeOption = function(val) {
		var self = this;

		if (!self.currentOptions.has(val)) return;

		self.currentOptions.delete(val);

		self.elem.children('[value="' + val + '"]').remove();
	};

	BoardSelector.prototype.clearOption = function() {
		var self = this;
		
		self.currentOptions = new Set();
		self.elem.children().remove();
	};

	$.fn.makeBoardSelector = function (options) {
		var boardSelector = new BoardSelector(options);
		$(this).data('board_selector', boardSelector);

		boardSelector.init($(this));

		return boardSelector;
	};
}(jQuery));
