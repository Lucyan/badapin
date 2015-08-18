'use strict';

var fs 			= require('fs-extra'),
	Stream 		= require('./stream.model'),
	Votacion 	= require('./votacion.model'),
	User 		= require('../users/user.model'),
	mongoose 	= require('mongoose');

exports.upload = function(req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		
		var filename = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 40; i++ )
			filename += possible.charAt(Math.floor(Math.random() * possible.length));

		filename += '-' + new Date().getTime() + '.jpg';

		//Path where image will be uploaded
		fstream = fs.createWriteStream(__dirname + '/../../public/' + filename);
		file.pipe(fstream);
		fstream.on('close', function () {
			res.status(200).json({'filename': filename});
		});
	});
};


exports.public = function(req, res) {
	console.log('public new stream');

	var token = req.get('Api-Token');

	User.findOne({token: token}, function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			var newStream = new Stream(req.body);
			newStream.user = user;

			newStream.save(function(err, newStream) {
				if (err)
					return res.status(500).json({err: err});

				res.status(200).json(newStream);
			});
		} else
			return res.status(409).json({msg: "Token inválido"});
	});
}

exports.index = function(req, res) {
	console.log('get stream');

	var token = req.get('Api-Token');

	User.findOne({token: token}, function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			
			if (user.seguidos.length > 0) {
				user.seguidos.push(user);

				Stream.find({'user': {'$in' : user.seguidos}}).sort({created: -1}).populate('user', '_id nick avatar').exec(function(err, streams) {
					if (err)
						return res.status(500).json({err: err});

					return res.status(200).json({ code : 0, streams: streams});
				});
			} else {
				return res.status(200).json({code: 1, msg: "Sin seuidos"});
			}
		} else
			return res.status(409).json({msg: "Token inválido"});
	});
}


exports.addVoto = function(req, res) {
	console.log("votacion");

	var token = req.get('Api-Token');

	User.findOne({token: token}, function(err, user) {
		if (err)
			return res.status(500).json({err: err});

		if (user) {
			Stream.findById(req.body.stream_id).exec(function(err, stream) {
				if (err)
					return res.status(500).json({err: err});

				if (stream) {
					Votacion.findOne({ palabra : req.body.palabra, stream : stream._id}).exec(function(err, votacion) {
						if (err)
							return res.status(500).json({err: err});

						var saveStream = false;

						if (!votacion) {
							votacion = new Votacion({
								palabra: req.body.palabra,
								stream:  stream._id
							});

							saveStream = true;
						}

						votacion.votos++;

						if (user.genre == 'M')
							votacion.masculino++;
						else
							votacion.femenino++;

						votacion.save(function(err, votacion) {
							if (err)
								return res.status(500).json({err: err});

							if (saveStream) {
								stream.votacion.push(votacion);
								stream.save(function(err, stream) {
									if (err)
										return res.status(500).json({err: err});

									Stream.findById(stream._id).populate('votacion', '-_id -stream').exec(function(err, stream) {
										if (err)
											return res.status(500).json({err: err});

										return res.status(200).json(stream);
									});
								});
							} else {
								Stream.findById(stream._id).populate('votacion', '-_id -stream').exec(function(err, stream) {
									if (err)
										return res.status(500).json({err: err});

									return res.status(200).json(stream);
								});
							}
						});
					});
				} else
					return res.status(409).json({msg: "Stream no existe"});
			});

		} else
			return res.status(409).json({msg: "Token inválido"});
	});
}