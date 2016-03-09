var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User' }, 					//저자
	region: { type: Schema.Types.ObjectId, ref: 'Region' },				//속한 지역
	board: { type: Schema.Types.ObjectId, ref: 'Board' },						//속한 지역에 무슨 게시판인지
	category: String,																								//카테고리
	title: { type: String, minlength: 4, maxlength: 40 },						//제목
	content: { type: String }, 																			//내용
	photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
});


module.exports = mongoose.model('Article', article);





