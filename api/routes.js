/**
 * Routes
 */

'use strict';

module.exports = function(app)  {
	app.use('/api/users', require('./users'));
	app.use('/api/stream', require('./stream'));
}