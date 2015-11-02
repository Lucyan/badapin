'use strict';

var User = require('./user.model');

//GET - Return all users in the DB
exports.findAllUsers = function(req, res) {
	User.find(function(err, users) {
	    if(err)
	    	return res.status(500).json({err: err});

	    console.log('GET /users')
		res.status(200).json({'users': users});
	});
};

exports.addUser = function(req, res) {
	console.log('Add User');

	var birthday = req.body.birthday.split('/');

	var user = new User({
		email: req.body.email,
		nick: req.body.nick,
		password: req.body.password,
		genre: req.body.genre,
		birthday: new Date(birthday[1] + '/' + birthday[0] + '/' + birthday[2])
	});

	user.save(function(err, user) {
		if (err)
				return res.status(500).json({err: err});

		console.log('new user:')
		console.log(user);
		console.log('**********************')

		User.findById(user._id).select('+token').exec(function(err, user) {
			if (err)
				return res.status(500).json({err: err});

			console.log('send token:')
			console.log(user);
			console.log('**********************')

			res.status(200).json(user);
		});
	});
};

exports.login = function(req, res) {
	console.log('Login user');

	User.findOne({email: req.body.email}).select('token password').exec(function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			if (user.password == req.body.password)
				res.status(409).json({'token': user.token});
			else
				res.status(200).json({'code': 0, 'msg': 'Password no coincide'});
		} else
			res.status(200).json({'code': 1, 'msg': 'E-Mail no encontrado'});
		
	})
}

exports.me = function(req, res) {
	console.log('Me')

	var token = req.get('Api-Token');

	User.findOne({token: token}).exec(function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			user.birthday_txt = user.birthday_txt;
			console.log(user);
			res.status(200).json(user);
		} else
			res.status(409).json({msg: "Token inválido"});
	});
}


exports.update = function(req, res) {
	console.log('Update Me')

	var token = req.get('Api-Token');

	User.findOne({token: token}, function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			var birthday = req.body.birthday.split('/');

			user.email = req.body.email;
			user.nick = req.body.nick;
			user.genre = req.body.genre;
			user.birthday = new Date(birthday[1] + '/' + birthday[0] + '/' + birthday[2]);

			user.save(function(err, user) {
				if (err) return res.status(500).json({err: err});
				return res.status(200).json(user);
			});
		} else
			return res.status(409).json({msg: "Token inválido"});
	});
}

exports.addSeguir = function(req, res) {
	console.log('Add Seguir');

	var token = req.get('Api-Token');

	User.findOne({token: token}).exec(function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			User.findById(req.body.seguir_id).exec(function(err, seguir) {
				if (err)
					return res.status(500).json({err: err});

				if (seguir) {
					for (var i = 0; i < user.seguidos.length; i++) {
						if (user.seguidos[i].equals(seguir._id))
							return res.status(200).json({code: 1, msg: "Ya sigues a este usuario"});
					};

					user.seguidos.push(seguir);

					user.save(function(err, user) {
						if (err)
							return res.status(500).json({err: err});

						seguir.seguidores.push(user);
						seguir.save();

						return res.status(200).json({code: 0, seguidos: user.seguidos.length});
					});
				} else {
					return res.status(409).json({code: 1, msg: "ID a seguir no existe"});
				}
			})
		} else
			return res.status(409).json({code: 1, msg: "Token inválido"});
	});
}

exports.deleteSeguir = function(req, res) {
	console.log('Delete Seguir');

	var token = req.get('Api-Token');

	User.findOne({token: token}).exec(function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			User.findById(req.body.seguir_id).exec(function(err, seguir) {
				if (err)
					return res.status(500).json({err: err});

				if (seguir) {
					for (var i = 0; i < user.seguidos.length; i++) {
						if (user.seguidos[i].equals(seguir._id))
							user.seguidos.splice(i, 1)
					};

					user.save(function(err, user) {
						if (err)
							return res.status(500).json({err: err});

						for (var i = 0; i < seguir.seguidores.length; i++) {
							if (seguir.seguidores[i].equals(user._id))
								seguir.seguidores.splice(i, 1)
						};
						seguir.save();

						return res.status(200).json({seguidos: user.seguidos.length});
					});
				} else {
					return res.status(409).json({msg: "ID a seguir no existe"});
				}
			})
		} else
			return res.status(409).json({msg: "Token inválido"});
	});
} 

exports.searchUser = function(req, res) {
	console.log('Search Users');

	var nick = req.query.nick;

	if (nick != '') {
		User.find({ 'nick' : {  "$regex": nick, "$options": "i" }}).select('nick avatar _id').exec(function(err, users) {
			if (err)
				return res.status(500).json({code: 2, err: err});

			if (users.length > 0) {
				return res.status(200).json({code: 0, users: users});
			} else {
				return res.status(200).json({code: 1, msg: "Usuario no encontrado"});
			}
		})
	} else {
		return res.status(200).json({code: 1, msg: "Usuario no encontrado"});
	}
}