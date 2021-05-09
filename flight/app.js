var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");

var indexRouter = require('./routes/index');
var flightsRouter = require('./routes/flights');
var bookingsRouter = require('./routes/bookings');

var app = express();

app.use(cors(
    {
      origin: ["http://127.0.0.1:8080","http://localhost:3000"],
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE']
    }
  ));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/flights', flightsRouter);
app.use('/bookings', bookingsRouter);

module.exports = app;
