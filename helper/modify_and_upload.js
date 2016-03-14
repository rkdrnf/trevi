var gm = require('gm').subClass({ imageMagick: true });

function ModifyAndUpload(images, callback){
	this.images = images;
	this.callback = callback;
	this.result = { files: [] };
	this.init(); }

/*
	 {"files": [
	 {
	 "name": "picture1.jpg",
	 "size": 902604,
	 "url": "http:\/\/example.org\/files\/picture1.jpg",
	 "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture1.jpg",
	 "deleteUrl": "http:\/\/example.org\/files\/picture1.jpg",
	 "deleteType": "DELETE"
	 },
	 {
	 "name": "picture2.jpg",
	 "size": 841946,
	 "url": "http:\/\/example.org\/files\/picture2.jpg",
	 "thumbnailUrl": "http:\/\/example.org\/files\/thumbnail\/picture2.jpg",
	 "deleteUrl": "http:\/\/example.org\/files\/picture2.jpg",
	 "deleteType": "DELETE"
	 }
	 ]}
	 */

ModifyAndUpload.prototype = {

	modifyImages: function(){
		var processedCount = 0;
		var that = this;
		this.images.forEach(function(image) {
			var thumbPath = that.newThumbPath + image.originalname;
			gm(that.originalImagePath + '/' + image.path)
			.resize(175, 175 + '^')
			.gravity('center')
			.extent(175, 175)
			.write(thumbPath, function (err){
				var fileInfo = {
					name: image.originalname,
					filename: image.filename,
					thumbnailName: image.originalname,
					size: image.size,
					url: '/' + image.path.split('/').slice(1).join('/'),
					thumbnailUrl: thumbPath,
					deleteUrl: image.path,
					deleteType: "DELETE"
				};
				that.result.files.push(fileInfo);
				processedCount++;
				if (processedCount === that.images.length && that.callback && typeof(that.callback) === 'function'){
					that.callback(err, that.result);
				}
			}); 

		});
	},

	init: function(){
		var saveFolder = process.cwd() + '/public/images/user_images/';
		this.originalImagePath = process.cwd();
		this.newThumbPath = saveFolder + 'thumbnail/';
		this.modifyImages();
	}
};

module.exports = ModifyAndUpload;
