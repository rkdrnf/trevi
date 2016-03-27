$(function() {

	$.ajax({
		url: "/ajax/regions_for_search",
		type: "GET",
		success: function(res) {
			makeTypeAhead(res);
		}
	});


	function makeTypeAhead(data) {
		var $input = $('.nav-search');
		$input.typeahead({
			source: data,
			autoSelect: true
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
