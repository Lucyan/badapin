'use strict';

var mongoose = require('mongoose');

var rand = function() {
	return Math.random().toString(36).substr(2);
};

var generateToken = function() {
	return rand() + rand();
};

var UserSchema = new mongoose.Schema({
	email:		{ type: String, required: true, unique: true },
	nick: 		{ type: String, required: true, unique: true },
	password: 	{ type: String, required: true, select: false },
	genre: 		{ type: String, enum: ['M', 'F'], required: true },
	birthday: 	{ type: Date, required: true },
	avatar: 	{ type: String, default: 'http://www.socialagent.me/wp-content/uploads/2014/07/avatarDefault.png' },
	token: 		{ type: String, default: generateToken(), select: false, unique: true },
	created: 	{ type: Date, default: Date.now },
	seguidos: 	[ { type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
	seguidores: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
	votaciones: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Stream'} ]
});

UserSchema.virtual('birthday_txt')
	.get(function() {
		var dd  = this.birthday.getDate().toString();
		var mm = (this.birthday.getMonth()+1).toString();
		var yyyy = this.birthday.getFullYear().toString();

		return dd + '/' + mm + '/' + yyyy;
	});

UserSchema.methods = {
	getByKeys: function(keys, only) {
		var data = this.toJSON();

		var resp = [];

		for (var key in data) {
			for (var i in keys) {
				if (key == keys[i]) {
					if (only) {
						resp[key] = data[key];
					} else
						delete data[key];
				}
			}
		}
		
		if (resp.length > 0)
			return resp;
		else
			return data;
	}
}

module.exports = mongoose.model('User', UserSchema);