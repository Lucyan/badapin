/**
 * Middlewares
 */

'use strict';

exports.hasRole = function(role) {
	if (role == 'user')
		return function(req, res, next) {
			if (req.get('Api-Token')) {
				next();
			} else {
				res.status(404).json({msg: "You shall not pass!!"});
			}
		}


	return function(req, res, next) {
		next();
	}
}