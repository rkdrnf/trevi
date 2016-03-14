var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 					//저자
	region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },				//속한 지역
	board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },						//속한 지역에 무슨 게시판인지
	title: { type: String, minlength: 4, maxlength: 40, required: true },						//제목
	content: { type: String, required: true }, 																			//내용
	photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
});


module.exports = mongoose.model('Article', article);





