$(function() {
	$('.star-button').makeStarButton({}, function (res, err) {
		if (err) {
			alert(err);
		} else {
			alert('추천되었습니다.');
		}
	});
});
