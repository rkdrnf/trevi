$(function() {
	tinymce.init({ 
		selector: '.tinymce',
		plugins: [
			'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
			'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
			'save table contextmenu directionality emoticons template paste textcolor'
		],
		content_css: 'css/content.css',
		toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
		file_browser_callback: function(field_name, url, type, win) {
			console.log("url: " + url);
			console.log("type: " + type);
			if(type=='image') $('.tinymce-image-input').click();
		},
		file_browser_callback_types: 'image',
		image_upload_url: '/upload_image',


	});

	$('.tinymce-image-input').fileupload({
		dataType: 'json',
		done: function (e, data) {
			console.log(data);
			$.each(data.result.files, function (index, file) {
				$('<p/>').text(file.name).appendTo(document.body);
			});
		}
	});



	$(document).on('change', ".tinymce-image-input", onImageUpload);

	function onImageUpload() {
		console.log('upload!');
	}


});
