var express = require('express');
var router = express.Router();
var index = require('./index.js');
var users = require('./users.js');
var admin = require('./admin/admin.js');
var regions = require('./regions.js');
var articles = require('./articles.js');
var blogs = require('./blog/blogs.js');
var journal = require('./journal.js');

/* GET home page. */

module.exports = function(app, passport) {
	app.use(function(req, res, next) {
		res.locals.user = req.user;
		next();
	});

	app.use('/', index);
	app.use('/', journal);
	app.use('/users', users);
	app.use('/admin', admin);
	app.use('/regions', regions);
	app.use('/articles', articles);
	app.use('/blogs', blogs);

	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage') }); 
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	app.get('/signup', function(req, res) {
		res.render('index', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

