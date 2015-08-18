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
    mongoose        = require('mongoose');

// Connection to DB
mongoose.connect(process.env.DATABASE_URL);

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
  app.listen(process.env.PORT, function() {
    console.log("Node server running on http://localhost:" + process.env.PORT);
  });
});

// Expose app
exports = module.exports = app;