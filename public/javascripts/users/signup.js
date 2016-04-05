$(function() {
	for(var i = 1; i <= 12; i++) {
		$('#signupModal select[name="birth_month"]').append(
			$('<option value="' + i + '">' + i + '월</option>')
		);
	}

	for(var d = 1; d <= 31; d++) {
		$('#signupModal select[name="birth_date"]').append(
			$('<option value="' + d + '">' + d + '</option>')
		);
	}

	for(var y = 1998; y >= 1916; y--) {
		$('#signupModal select[name="birth_year"]').append(
			$('<option value="' + y + '">' + y + '</option>')
		);
	}
});
