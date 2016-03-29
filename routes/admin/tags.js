var router = require('express').Router();
var Tag = require('../../models/tag.js');

router.get('/', function(req, res) {
	Tag.find().lean().exec(function(err, tags) {
		res.render('admin/tags/index', { tags: tags });
	});
});


router.get('/delete/:id', function(req, res) {
	Tag.remove({ _id: req.params.id }, function(err) {
		if (err) {
			console.log(err);
		} 

		res.redirect('../');
	});
});

module.exports = router;
