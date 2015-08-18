'use strict';

var mongoose = require('mongoose');

var VotacionSchema = new mongoose.Schema({
	palabra		: { type: String, required: true },
	stream 		: { type: mongoose.Schema.Types.ObjectId, ref: 'Stream', required: true},
	votos 		: { type: Number, default: 0 },
	masculino 	: { type: Number, default: 0 },
	femenino 	: { type: Number, default: 0 }
});

module.exports = mongoose.model('Votacion', VotacionSchema);