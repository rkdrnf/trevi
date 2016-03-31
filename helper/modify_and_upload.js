var gm = require('gm').subClass({ imageMagick: true });
var shortid = require('shortid');
var Photo = require('../models/photo.js');

function processImages(imageGetter, options) {
	return function(req, res, next) {
		var images = imageGetter(req);
		new ModifyAndUpload(images, options, function (result) {
			req.processedImages = result;
			next();
		});
	};
} 
function ModifyAndUpload(images, options, callback){
	this.images = images;
	this.callback = callback;
	this.result = { files: [] };

	this.options = {
		type: 'Article',
		saves: 'thumbnail',
		thumbnail_size: { x: 175, y: 175 },
		masonry_size: { x: 400, y: 500 }
	};

	extend(this.options, options);

	this.appPath = process.cwd();
	this.basePath = this.appPath + '/public';
	this.toProcessCount = images.length * this.options.saves.split(' ').length;
	this.init(); 

}

function extend(a, b){
	for(var key in b)
		if(b.hasOwnProperty(key))
			a[key] = b[key];
	return a;
}


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
		var self = this;
		var saves = this.options.saves.split(' ');
		self.images.forEach(function(image) {
			var fileInfo = {
				name: image.originalname,
				filename: image.filename,
				size: image.size,
				original: {
					path: '/' + image.path.split('/').slice(1).join('/'),
					size: { x: image.size.x, y: image.size.y },
					name: image.filename
				},
				deleteUrl: image.path,
				deleteType: "DELETE"
			};

			self.result.files.push(fileInfo);

			saves.forEach(function(saveType) {
				self.modifyAndSave(image, saveType, fileInfo);
			});
		});
	},

	modifyAndSave: function(image, saveType, fileInfo) {
		switch(saveType) {
			case 'thumbnail': 
				this.saveThumbnail(image, fileInfo);
				break;
			case 'masonry':
				this.saveMasonry(image, fileInfo);
				break;
			default:
				throw new Error('undefined saveType!!');
		}
	},

	saveThumbnail: function(image, fileInfo) {
		var self = this;
		var name = shortid.generate();
		var thumbnailPath = Photo.getThumbnailPath(self.options.type) + name;
		var savePath = self.basePath + thumbnailPath;
		var originalImage = self.appPath + '/' + image.path;

		var imageSize = self.options.thumbnail_size;
		gm(originalImage)
		.resize(imageSize.x + '^', imageSize.y + '^')
		.gravity('Center')
		.crop(imageSize.x, imageSize.y)
		.write(savePath, function (err){
			if (err) throw err;
			gm(savePath).size(function(err, size) {
				if (err) throw err;
				fileInfo.thumbnail = {
					path: thumbnailPath,
					size: {
						x: size.width,
						y: size.height
					},
					name: name
				};

				self.toProcessCount--;
				self.checkAllProcessed();

			});
		}); 
	},

	saveMasonry: function(image, fileInfo) {
		var self = this;
		var name= shortid.generate();
		var masonryPath = Photo.getMasonryPath(self.options.type) + name; 
		var savePath = self.basePath + masonryPath;
		var originalImage = self.appPath + '/' + image.path;

		var imageSize = self.options.masonry_size;

		gm(originalImage)
		.resize(imageSize.x)
		.write(savePath, function (err){
			if (err) throw err;
			gm(savePath).size(function(err, size) {
				fileInfo.masonry = {
					path: masonryPath,
					size: {
						x: size.width,
						y: size.height
					},
					name: name
				};

				self.toProcessCount--;
				self.checkAllProcessed();
			}); 
		});
	},

	checkAllProcessed: function() {
		var self = this;
		if (self.toProcessCount === 0) {
			self.callback(self.result);
		}
	},

	init: function(){
		this.modifyImages();
	}
};

module.exports = processImages;
