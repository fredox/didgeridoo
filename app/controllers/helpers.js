module.exports = {
	csrf: function(req, res, next) {
		res.locals.csrf_token = req.csrfToken()
		next();
	},

	authRequired: function(req, res, next) {
		var routes = require('../../config/route_table');

		if( !req.session.user ) {
			res.redirect( routes.user.login );
		} else {
			next();
		}
	},

	loadUser: function(req, res, next) {
		var User = require('mongoose').model('User');

		// id === 0 means it referes to the current logged user
		if( req.params.id === '0' && req.session.user && req.session.user.id ) {
		    req.params.id = req.session.user.id;
		    console.dir(req.session.user.id);
		}

		User.find(req.params.id, function (err, user) {
		    if (err || !user) {
		        res.json(404, {error: 'Not found'});
		    } else {
		        this.user = user;
		        next();
		    }
		});
	}
};