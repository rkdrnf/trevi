(function($) {
	$.fn.makeStarButton = function (options, callback) {
		var action = $(this).attr('data-action');
		var id = $(this).attr('data-id');

		$(this).on('click', function() {
			$.ajax({
				url: action,
				method: "POST",
				data: {id: id},
				error: function (err) {
					callback(undefined, err)
					console.log(err);
				},
				success: function (res) {
					callback(res, undefined);
					console.log('success');
				}
			});
		});
	};
}(jQuery));
