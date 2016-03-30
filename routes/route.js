var express = require('express');
var router = express.Router();
var index = require('./index.js');
var users = require('./users.js');
var admin = require('./admin/admin.js');
var regions = require('./regions.js');
var articles = require('./articles.js');
var blogs = require('./blog/blogs.js');
var journal = require('./journal.js');
var images = require('./images.js');
var uploads = require('./uploads.js');

var jadeHelper = require('../helper/jade_helper.js');
var routerHelper = require('../helper/router_helper.js');
var globalHelper = require('../helper/global_helper.js');

_ = require('lodash');

/* GET home page. */

module.exports = function(app, passport) {
	app.use(function(req, res, next) {
		res.locals.user = req.user;
		next();
	});

	app.use(function(req, res, next) {
		res.locals.path = req.path;
		res.locals.url = req.url;
		next(); }); 
	app.use(function(req, res, next) {
		res.locals.jadeHelper = jadeHelper;
		next();
	});

	app.use('/', index);
	app.use('/', journal);
	app.use('/users', users);
	app.use('/admin', admin);
	app.use('/regions', regions);
	app.use('/articles', articles);
	app.use('/blogs', blogs);
	app.use('/images', images);
	app.use('/uploads', uploads);
	app.use('/ajax', require('./ajax.js'));
	app.use('/comments', require('./comments.js'));

	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage'), after_login: encodeURIComponent(req.query.after_login) }); 
	});

	app.post('/login', passport.authenticate('local-login', {
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}), function(req, res) {
		console.log(req.query.after_login);
		if (req.query.after_login && routerHelper.isValidURLPath(req.query.after_login))
			res.redirect(req.query.after_login);
		else 
			res.redirect('/');
	});

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/',
		failureRedirect : '/'
	}));

	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
	// send to google to do the authentication
	// profile gets us their basic information including their name
	// email gets their emails
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/'
	}));

	app.get('/signup', function(req, res) {
		res.render('index', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}), function(req, res) {
		res.redirect(routerHelper.tryUseRedirectUrl(req, '/'));
	});


	app.get('/profile', routerHelper.checkUserLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect(routerHelper.tryUseRedirectUrl(req, 'back'));
	});

	app.get('/test', function(req, res) {
		res.render('test');
	});
};


