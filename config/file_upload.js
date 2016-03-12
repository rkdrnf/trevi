var upload = require('jquery-file-upload-middleware');

module.exports = function(app) {
	upload.configure({
		uploadDir: __dirname + '/../public/images/user_images',
		uploadUrl: '/images/user_images',
		imageVersions: {
			thumbnail: {
				width: 80,
				height: 80
			}
		}
	});

	app.use('/upload', upload.fileHandler());
};
