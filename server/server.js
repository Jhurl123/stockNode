var https = require('https');
var router = ('./router');
var express = require('express');

var app = express();
exports.app = app;

//set view engine to 'ejs'
app.set('view engine', 'ejs');