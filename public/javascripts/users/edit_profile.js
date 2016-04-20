$(function() {
	var birth = $('#birthValue').val().split('-');

	for(var y = 1998; y >= 1916; y--) {
		$('#userEditForm select[name="birth_year"]').append(
			$('<option value="' + y + '">' + y + '</option>')
		);
	}

	for(var i = 1; i <= 12; i++) {
		$('#userEditForm select[name="birth_month"]').append(
			$('<option value="' + i + '">' + i + '월</option>')
		);
	}

	for(var d = 1; d <= 31; d++) {
		$('#userEditForm select[name="birth_date"]').append(
			$('<option value="' + d + '">' + d + '</option>')
		);
	}

	console.log(birth);

	if (birth.length === 3) {
		$('#userEditForm select[name="birth_year"]').val(birth[0]);
		$('#userEditForm select[name="birth_month"]').val(+birth[1] + 1);
		$('#userEditForm select[name="birth_date"]').val(birth[2]);
	}

	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object

		var output = [];
		for (var i = 0; i < files.length; i++) {
			var f = files[i];
			console.log(f);
			$('.photo-preview').children().remove();
			$('.photo-preview').append('<img class="profile-preview" src="' + URL.createObjectURL(f) + '">');
		}

	}

	document.getElementById('profilePhoto').addEventListener('change', handleFileSelect, false);
});
