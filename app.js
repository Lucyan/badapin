/**
 * Main application file
 */

'use strict';

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    busboy          = require('connect-busboy'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    config          = require('./config.js');

// Connection to DB
mongoose.connect(config.mongo.uri);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(busboy());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
require('./api/routes')(app);

// Start server
mongoose.connection.on('connected', function () {
  console.log('Connected to Database');
  app.listen(config.port, function() {
    console.log("Node server running on http://localhost:" + config.port);
  });
});

// Expose app
exports = module.exports = app;