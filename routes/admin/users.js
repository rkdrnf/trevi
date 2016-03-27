var router = require('express').Router();
var User = require('../../models/user.js');

router.get('/', function(req, res, next) {
	User.find().lean().exec(function (err, users) {
		res.render('admin/users/index', { users: users });	
	});
});


router.get('/delete/:id', function(req, res, next) {
	User.remove({ _id: req.params.id}, function(err) {
		res.redirect('../');
	});
});


module.exports = router;
