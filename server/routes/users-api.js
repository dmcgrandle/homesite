/* users-api.js - router for '/api/users' path API */

// External Imports:
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

// Project Imports:
const tokenSvc = require('../services/token-service');
const userSvc = require('../services/user-service');
const errSvc = require('../services/err-service');

// middleware that is specific to this router
router.use((req, res, next) => {
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
    '/api/users/changepw-by-token'],
}));
router.use(bodyParser.json());

/* POST /login user for authentication. */
router.post('/login', (req, res) => {
// let id = -1;
  let token = '';
  let lvl = 0; // setup default invalid values
  userSvc.isValidLevel(req.body, 2) // min level 2 to log in
    .then(() => userSvc.isValidPassword(req.body))
    .then(() => tokenSvc.getNew(req.body.username))
    .then((r) => { token = r; return userSvc.getLevel(req.body); })
    .then((r) => { lvl = r; return tokenSvc.expiryTime(token); })
    .then((exp) => { // All values now verified - construct response to client
      console.log('Successful login for user: ' + req.body.username);
      res.status(200).json({ // set up info returned to client on login
        jwtToken: token,
        level: lvl,
        expiresAt: exp,
      });
    })
    .catch(err => errSvc.processError(err, res));
});

/* POST /create to create new user. */
router.post('/create', (req, res) => {
  userSvc.isUnique(req.body)
    .then(() => userSvc.create(req.body))
    .then(newUser => res.status(201).json(newUser))
    .catch(err => errSvc.processError(err, res));
});

/* PUT /update to update existing user data */
router.put('/update', (req, res) => {
  userSvc.isValidLevel(req.user, 4)
    .then(() => userSvc.update(req.body))
    .then(user => res.status(201).json(user))
    .catch(err => errSvc.processError(err, res));
});

/* POST /forgot to reset password for a user. */
router.post('/forgot', (req, res) => {
  userSvc.getUserByEmail(req.body)
    .then(userReturned => userSvc.emailReset(userReturned))
    .then(emailedUser => res.status(201).json(emailedUser))
    .catch(err => errSvc.processError(err, res));
});

/* change password using token sent via email */
router.post('/changepw-by-token', (req, res) => {
  tokenSvc.isValidEmailToken(req.body.token)
    .then(() => userSvc.changePassword(false, req.body))
    .then(user => res.status(201).json('Password changed for user: ' + user.username))
    .catch(err => errSvc.processError(err, res));
});

/* change password using existing password */
router.post('/changepw-by-pw', (req, res) => {
  userSvc.isValidLevel(req.user, 2)
    .then(() => userSvc.changePassword(true, req.body))
    .then(user => res.status(201).json('Password changed for user: ' + user.username))
    .catch(err => errSvc.processError(err, res));
});

/* DELETE /one to delete a single user.  Needs level 4+ access */
router.delete('/one', (req, res) => {
  userSvc.isValidLevel(req.user, 4) // check username in jwt token for level
    .then(() => userSvc.delete(req.body))
    .then(delUser => res.status(200).send('user ' + delUser.username + ' is deleted'))
    .catch(err => errSvc.processError(err, res));
});

/* GET list of users in the system.  Needs level 4+ access */
router.get('/list', (req, res) => {
  userSvc.isValidLevel(req.user, 4)
    .then(() => userSvc.getListSansPasswords())
    .then(userList => res.status(200).json(userList))
    .catch(err => errSvc.processError(err, res));
});

/* Logout is now done in the client, server is stateless

router.put('/logout', function (req, res, next) {
  // note: express-jwt has decoded the token and put info into req.user
  console.log('req.user: ' + JSON.stringify(req.user));
  next();
}); */

module.exports = router;
