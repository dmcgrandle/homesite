/* app.js - main entry point for homesite. */

// Imports:
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Set up routers:
const protectedRouter = require('./routes/protected');
const usersRouter = require('./routes/users-api');
const photosRouter = require('./routes/photos-api');
const videosRouter = require('./routes/videos-api');
const downloadsRouter = require('./routes/downloads-api');

// Use Routers:

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, '../mcg/dist/mcg')));
//app.use(express.static(path.join(__dirname, 'public')));

// Use Routers:
app.use('/protected', protectedRouter);
app.use('/api/users', usersRouter);
app.use('/api/photos', photosRouter);
app.use('/api/videos', videosRouter);
app.use('/api/downloads', downloadsRouter);


// change default to handle all unknown requests by angular app - pass to index.html
app.get('*', function(req,res) { res.sendFile('index.html', { root: 'public'})});

/*
app.all('*', function(req, res, next) {
  // Shouldn't get here, someone typed something incorrectly.
  res.status(400).send('No such resource "' + req.originalUrl + '"');
}); */

module.exports = app;
