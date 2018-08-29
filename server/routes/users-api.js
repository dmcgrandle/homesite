/* users-api.js - router for '/api/users' path API */

// External Imports:
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Project Imports:
const tokenSvc = require('../services/token-service');
const userSvc = require('../services/user-service');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log(Date(Date.now()) + " : Login API called - '" + req.originalUrl + "'");
    next();
});
// This next call checks for a valid jwt token, needed for ALL calls to /users
// EXCEPT for calls to /users/login (since logging in gets the token ...)
// and for calls to /users/create (since client will create new inactive user
// who then must be activated by an admin to then finally login and get a token)
// and to /users/forgot since they need to reset password to login again
router.use(tokenSvc.middlewareCheck({
    path: ['/api/users/login', '/api/users/create', '/api/users/forgot',
        '/api/users/changepw-by-token']
}));
router.use(bodyParser.json());

/* POST /login user for authentication. */
router.post('/login', function (req, res, next) {
    let id = -1, token = "", lvl = 0; // setup default invalid values
    userSvc.isValidLevel(req.body, 2) // min level 2 to log in
        .then(() => userSvc.isValidPassword(req.body))
        .then(() => tokenSvc.getNew(req.body.username))
        .then(r => { token = r; return userSvc.getLevel(req.body) })
        .then(r => { lvl = r; return tokenSvc.expiryTime(token) })
        .then(exp => { // All values now verified - construct response to client
            console.log('Successful login for user: ' + req.body.username);
            res.status(200).json({ // set up info returned to client on login
                jwtToken: token,
                level: lvl,
                expiresAt: exp
            });
        })
        .catch((err) => processError(err, res));
});


/* POST /create to create new user. */
router.post('/create', function (req, res, next) {
    userSvc.isUnique(req.body)
        .then(() => userSvc.create(req.body))
        .then(newUser => res.status(201).json(newUser))
        .catch(err => processError(err, res));
});

/* PUT /update to update existing user data */
router.put('/update', function (req, res, next) {
    userSvc.isValidLevel(req.user, 4)
        .then(() => userSvc.update(req.body))
        .then(user => res.status(201).json(user))
        .catch(err => processError(err, res));
});

/* POST /forgot to reset password for a user. */
router.post('/forgot', function (req, res, next) {
    userSvc.getUserByEmail(req.body)
        .then(userReturned => userSvc.emailReset(userReturned))
        .then(emailedUser => res.status(201).json(emailedUser))
        .catch(err => processError(err, res));
});

/* change password using token sent via email */
router.post('/changepw-by-token', function (req, res, next) {
    tokenSvc.isValidEmailToken(req.body.token)
        .then(() => userSvc.changePassword(false, req.body))
        .then(user => res.status(201).json('Password changed for user: ' + user.username))
        .catch(err => processError(err, res));
});

/* change password using existing password */
router.post('/changepw-by-pw', function (req, res, next) {
    userSvc.isValidLevel(req.user, 2)
        .then(() => userSvc.changePassword(true, req.body))
        .then(user => res.status(201).json('Password changed for user: ' + user.username))
        .catch(err => processError(err, res));
});

/* DELETE /one to delete a single user.  Needs level 4+ access */
router.delete('/one', function (req, res, next) {
    userSvc.isValidLevel(req.user, 4) // check username in jwt token for level
        .then(() => userSvc.delete(req.body))
        .then(delUser => res.status(200).send('user ' + delUser.username + ' is deleted'))
        .catch(err => processError(err, res));
});


/* GET list of users in the system.  Needs level 4+ access */
router.get('/list', function (req, res, next) {
    userSvc.isValidLevel(req.user, 4)
        .then(() => userSvc.getListSansPasswords())
        .then(userList => res.status(200).json(userList))
        .catch(err => processError(err, res));
});

// Utility functions for users route API

processError = function (err, res) {
    // This function called when an error has occurred during the settling of a
    // Promise.  Two possibilites - it could be an internal server error, or
    // it could be a code we've thrown ourselves to send client back relevant
    // error info: first 3 chars are the statusCode, rest is the err message.
    console.log(Date(Date.now()) + ' : ' + err.stack);
    let statusCode = Number(err.message.slice(0, 3));
    if (!statusCode) {// not our error - no 3 digit number at the front
        res.status(500).send('Server Error "' + err.message + '" - see server log for details');
    }
    else { // one of our error messages, decode and send.
        let msg = err.message.slice(4);
        res.status(statusCode).send(msg);
    }
}

/* router.put('/logout', function (req, res, next) {
  // note: express-jwt has decoded the token and put info into req.user
  console.log('req.user: ' + JSON.stringify(req.user));
  next();
}); */

module.exports = router;
