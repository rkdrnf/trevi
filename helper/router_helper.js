var routerHelper = {};

routerHelper.checkUserLoggedIn = function (req, res, next) {
	if (req.user) {
		next();
		return;
	}

	console.log('nouser');

	req.session.after_login_url = req.url;
	res.redirect('/login');
	return;
}

module.exports = routerHelper;
