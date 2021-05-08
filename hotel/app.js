var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var flightsRouter = require('./routes/hotels');
var bookingsRouter = require('./routes/bookings');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/hotels', flightsRouter);
app.use('/bookings', bookingsRouter);

module.exports = app;
