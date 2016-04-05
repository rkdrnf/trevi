var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User            = require('../models/user.js');
var ProfilePhoto = require('../models/profile_photo.js');
var configAuth = require('./auth.js');

module.exports = function(passport) { passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id).populate('profile_photo').exec(function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	}, function(req, email, password, done) {

		if (User.isValidName(req.body.name) === false) {
			return done(null, false, req.flash('error', 'Invalid Name'));
		}

		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {

			User.findOne({ 'local.email' :  email }, function(err, user) {
				if (err)
					return done(err);

				if (user) {
					return done(null, false, req.flash('error', 'That email is already taken.'));
				} else {
					var newUser            = new User();

					newUser.local.name		 = req.body.name;
					newUser.local.email    = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.sex = req.body.sex;
					var birth = new Date(+req.body.birth_year, +req.body.birth_month - 1, +req.body.birth_date);
					newUser.birth = birth; 

					newUser.save(function(err) { if (err) throw err;
											 return done(null, newUser);
					});
				}
			});    
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	}, function(req, email, password, done) { // callback with email and password from our form
		User.findOne({ 'local.email' :  email }).exec(function(err, user) {
			if (err)
				return done(err);
			if (!user)
				return done(null, false, req.flash('error', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			if (!user.validPassword(password))
				return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

			return done(null, user);
		});
	}));

	// =========================================================================
	// FACEBOOK ================================================================
	// =========================================================================
	passport.use(new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
		clientID        : configAuth.facebookAuth.clientID,
		clientSecret    : configAuth.facebookAuth.clientSecret,
		callbackURL     : configAuth.facebookAuth.callbackURL

	},
	// facebook will send back the token and profile
	function(token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
			User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

				// if there is an error, stop everything and return that
				// ie an error connecting to the database
				if (err)
					return done(err);

				// if the user is found, then log them in
				if (user) {
					return done(null, user); // user found, return that user
				} else {
					// if there is no user found with that facebook id, create them
					var newUser            = new User();

					// set all of the facebook information in our user model
					newUser.facebook.id    = profile.id; // set the users facebook id                   
					newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
					newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
					newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

					// save our user to the database
					newUser.save(function(err) {
						if (err)
							throw err;

						// if successful, return the new user
						return done(null, newUser);
					});
				}
			});
		});
	}));
	// =========================================================================
	// GOOGLE ==================================================================
	// =========================================================================
	passport.use(new GoogleStrategy({
		clientID        : configAuth.googleAuth.clientID,
		clientSecret    : configAuth.googleAuth.clientSecret,
		callbackURL     : configAuth.googleAuth.callbackURL,
	},
	function(token, refreshToken, profile, done) {
		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {

			// try to find the user based on their google id
			User.findOne({ 'google.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				if (user) {

					// if a user is found, log them in
					return done(null, user);
				} else {
					// if the user isnt in our database, create a new user
					var newUser          = new User();

					// set all of the relevant information
					newUser.google.id    = profile.id;
					newUser.google.token = token;
					newUser.google.name  = profile.displayName;
					newUser.google.email = profile.emails[0].value; // pull the first email
					newUser.sex = profile.gender.capitalize();



					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						ProfilePhoto.create({ path: profile._json.image.url, thumbnail: profile._json.image.url, is_remote: true, owner: newUser._id }, function(err, photo) {
							newUser.profile_photo = photo._id;
							newUser.save(function(err) {
								if (err)
									throw err;

								return done(null, newUser);
							});
						});
					});
				}
			});
		});
	}));
};

