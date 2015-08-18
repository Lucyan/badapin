'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../middlewares.js')

var router = express.Router();

router.get('/', controller.findAllUsers);
router.post('/', controller.addUser);
router.post('/login', controller.login);
router.get('/me', auth.hasRole('user'), controller.me);
router.put('/me', auth.hasRole('user'), controller.update);

router.post('/seguidos', auth.hasRole('user'), controller.addSeguir);
router.delete('/seguidos', auth.hasRole('user'), controller.deleteSeguir);

router.get('/search', controller.searchUser);

module.exports = router;