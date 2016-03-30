$(function() {
	$('.tag-select').makeTagSelector();

	$('input[type="text"]').keydown(function(e) {
		if (e.keyCode == 13)
			{
				e.preventDefault();
				$(this).trigger("enterKey");
			}
	});

	$('.upload-photo').on('click', function() {
		$('.photo_input').click();
	});

	$('.photo_input').change(function(e) {
		$('.upload-photo').html('');
		$('.upload-photo').children().remove();

		if (e.target.files.length > 0) {
			var $photo = $('<img class="uploaded" />');
			$photo.attr('src', window.URL.createObjectURL(e.target.files[0]));
			$('.upload-photo').append($photo);
		}
		else {
			var $text = $('<span>+</span>');
			$('.upload-photo').append($text);
		}
	});
});
