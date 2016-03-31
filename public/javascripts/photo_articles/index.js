$(function() {
	$('.grid').imageLoaded(function() {
		$('.grid').masonry({
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			percentPosition: true
		});

	});
});
