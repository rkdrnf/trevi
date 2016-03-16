$(function() {

	$.ajax({
		url: "/ajax/regions_for_search",
		type: "GET",
		success: function(res) {
			makeTypeAhead(res);
		}
	});


	function makeTypeAhead(data) {
		var $input = $('.region_select');
		$input.typeahead({
			source: data,
			autoSelect: true,
			ajax: {
				url: "/regions/ajax_regions_for_search"
			}
		}); 
		$input.change(function() {
			var current = $input.typeahead("getActive");
			if (current) {
				if (current.name == $input.val()) {
				} else {
				}
			} else {
			}
		});

	}

});
