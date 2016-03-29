(function($) {
	$.fn.makeStarButton = function (options, callback) {
		$(this).each(function() {
			var action = $(this).attr('data-action');
			var id = $(this).attr('data-id');

			$(this).on('click', function() {
				$.ajax({
					url: action,
					method: "POST",
					data: {id: id},
					error: function (err) {
						callback(undefined, err);
					},
					success: function (res) {
						callback(res, res.error);
					}
				});
			});


		});
	};
}(jQuery));
