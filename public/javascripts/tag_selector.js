(function($) { 
	var TagSelector = function(options) {
		var self = this;
		self.selectedTags = [];

		var defaultOption = {};
		self.options = $.extend({}, defaultOption, options);
	};

	TagSelector.prototype.init = function($elem) {
		var self = this;

		self.elem = $elem;

		self.wrapper = $('<div class=\"tag-selector-wrapper\"></div>');
		self.elem.wrap(self.wrapper);

		self.tagsBox= $('<div class=\"tags-box\"></div>');
		self.elem.after(self.tagsBox);

		self.hiddenInput = $('<input type="hidden" name="tags">');
		self.elem.after(self.hiddenInput);

		var tagHound = new Bloodhound({
			name: "tags",
			prefetch: {
				url: "/ajax/tags_autocomplete",
				transform: function(res) {
					return res.tags;
				}
			},
			identify: function(d) { return d.name; },
			datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.name); },
			queryTokenizer: Bloodhound.tokenizers.whitespace
		});

		tagHound.initialize(); 
		var ta = $(".tag-select").typeahead({
			highlight: true
		},
		{
			displayKey: "name",
			limit: 10,
			source: tagHound.ttAdapter(),
		}).bind('typeahead:select', function(ev, suggestion) {
			self.addSelectedTag(suggestion);
			ta.typeahead("close").typeahead('val', '');
		});
		
		ta.bind('typeahead:autocomplete', function(ev, suggestion){
			self.addSelectedTag(suggestion);
			ta.typeahead("close").typeahead('val', '');
		});

		ta.bind('enterKey', function() {
			self.addSelectedTag({ name: $(this).typeahead("val") });
			ta.typeahead("val", "");
		});
		
		ta.bind('keypress', function(e) {
			if(e.keyCode === 32) {
				e.preventDefault();
				self.addSelectedTag({ name: $(this).typeahead("val") });
				ta.typeahead("val", "");
			}
		});
	};

	function isValid(str){
	 return !/[~`!#$%\^&*+=\-\[\]\\';.,/{}|\\":<>\?]/g.test(str);
	}
	
	TagSelector.prototype.addSelectedTag = function(tag) {
		var self = this;

		if (!isValid(tag.name)) {
			return;
		}

		if (self.selectedTags.indexOf(tag.name) !== -1) return;

		self.selectedTags.push(tag.name);
		self.hiddenInput.val(self.selectedTags.join(';'));

		var $button = $('<a class="btn btn-default selected-tag">' + tag.name + '<span class="x-icon">x</span></button>'); 

		$button.on('click', function() { self.removeSelectedTag($button, tag); });
		self.tagsBox.append($button);

		if (self.options.onAddTag) {
			self.options.onAddTag(tag);
		}
	};

	TagSelector.prototype.removeSelectedTag = function($button, tag) {
		var self = this;
		$button.remove();

		var index = self.selectedTags.indexOf(tag.name);
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

		tagSelector.init($(this));
		return tagSelector;
	};
}(jQuery));
