'use strict';

var mongoose = require('mongoose');

var StreamSchema = new mongoose.Schema({
	url 		: { type: String },
	descripcion : { type: String },
	user 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	votacion 	: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Votacion' } ],
	created 	: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stream', StreamSchema);