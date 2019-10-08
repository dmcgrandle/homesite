/* server.ts - main express node server file for homesite, imported by start.ts */

// Imports:
// const express = require('express');
import * as express from 'express';
// import express, { Router } from 'express';
// const path = require('path');
import * as path from 'path';
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
import * as logger from 'morgan';

// Set up routers:
import protectedRouter from './routes/protected';
import usersRouter from './routes/users-api';
import photosRouter from './routes/photos-api';
import videosRouter from './routes/videos-api';
import downloadsRouter from './routes/downloads-api';

export class Server {
  public app: express.Application;

  public constructor() {
    console.log('Server constructor is executed.');
    this.app = express();
    this.config();
    this.api();
    this.static();
  }

  public static bootstrap(): Server {
    return new Server();
  }

  public config(): void {
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    // this.app.use(express.static(path.join(__dirname, '../mcg/dist/mcg')));
    // this.app.use(express.static(path.join(__dirname, 'public')));
  }
  public api(): void {
    this.app.use('/api/users', usersRouter);
    this.app.use('/api/photos', photosRouter);
    this.app.use('/api/videos', videosRouter);
    this.app.use('/api/downloads', downloadsRouter);
  }
  public static(): void {
    this.app.use('/protected', protectedRouter);
    // setup get to resolve to index.html to allow angular router for client routes:
    this.app.get('*', (req, res): void => res.sendFile('index.html', { root: 'public' }));
  }
}

// Use Routers:

// change default to handle all unknown requests by angular app - pass to index.html

/*
app.all('*', function(req, res, next) {
  // Shouldn't get here, someone typed something incorrectly.
  res.status(400).send('No such resource "' + req.originalUrl + '"');
}); */

// module.exports = app;
