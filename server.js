// Dependencies
const express = require('express');
const hb = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');

// Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static assets
app.use(express.static(__dirname + '/public'));

// Handlebars view engine
app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Controller routes
const routes = require('./controllers/controller.js');
app.use(routes);

// DB config
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/gumtree";
mongoose.Promise = Promise;

// Connect DB and start app
mongoose.connect(MONGODB_URI).then(function() {;
    app.listen(PORT, function() {
        console.log('App listening on port '+PORT);
    });
});