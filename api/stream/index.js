'use strict';

var express = require('express');
var controller = require('./stream.controller');
var auth = require('../middlewares.js')

var router = express.Router();

router.get('/', auth.hasRole('user'), controller.index);
router.post('/upload', auth.hasRole('user'), controller.upload);
router.post('/public', auth.hasRole('user'), controller.public);

router.post('/votar', auth.hasRole('user'), controller.addVoto);

module.exports = router;