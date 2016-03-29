(function($) { 
	var TagSelector = function(options) {
		var self = this;
		self.selectedTags = [];

		var defaultOption = {};
		self.options = $.extend({}, defualtOption, options);
	};

	TagSelector.prototype.init = function($elem) {
		var self = this;
		self.elem = $elem;
		$.ajax({
			url: "/ajax/tags_autocomplete",
			type: "GET",
			success: function(res) {
				self.initData(self.elem, res);
			}
		});

		self.wrapper = $('<div class=\"tag-selector-wrapper\"></div>');
		self.elem.wrap(self.wrapper);

		self.tagsBox= $('<div class=\"tags-box\"></div>');
		self.elem.after(self.tagsBox);

		self.hiddenInput = $('<input type="hidden" name="tags">');
		self.elem.after(self.hiddenInput);
	};

	TagSelector.prototype.initData = function($elem, data) {
		var self = this;
		$elem.typeahead({
			source: data,
			autoSelect: true,
			afterSelect: function (item) {
				self.addSelectedTag(item.name);
			}
		});
	};

	TagSelector.protoype.addSelectedTag = function(tag) {
		var self = this;

		if (self.selectedTags.indexOf(tag) !== -1) return;

		self.selectedTags.push(tag);
		self.hiddenInput.val(self.selectedtags.join(';'));

		var $button = $('<a class="btn btn-default selected-tag">' + tag + '<span class="x-icon">x</span></button>'); 

		$button.on('click', function() { self.removeSelectedTag($button, tag); });
		self.tagsBox.apeend($button);

		if (self.options.onAddTag) {
			self.options.onAddTag(tag);
		}
	};

	TagSelector.prototype.removeSelectedTag = function($button, tag) {
		var self = this;
		$button.remove();

		var index = self.selectedTags.indexOf(tag);
		if (index === -1) return;

		self.selectedTags.splice(index, 1);
		self.hiddenInput.val(self.selectedTags.join(';'));

		if (self.options.onRemoveTag) {
			self.options.onRemoveTag(tag);
		}
	};

	$.fn.makeTagSelector = function (options) {
		var tagSelector = new TagSelector(options);
		$(this).data('tag_selector', tagSelector);
	}
}(jQuery));
