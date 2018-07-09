/* -----------------            user-service.js                 ------------------
Provides services for user accounts and protected resources.
User account levels:
level 0 - deleted - user account has been deleted
level 1 - inactive - account created but not yet activated
level 2 - read - standard account able to download protected content
level 3 - write - enhanced account able to read and upload to protected content
level 4 - admin - account able to download/upload and manage user accounts
------------------------------------------------------------------------------*/

// External Imports:
const fs = require('fs-extra');
const assert = require('assert');
const nodemailer = require('nodemailer');
const util = require('util');

// Project Imports:
const tokenSvc = require('./token-service');

// Constants:
// TODO: put these in a config file
const SERVER_URL = 'http://localhost:3000';
const DEFAULT_USERS = './default-users.json';
const MIN_FIELD_LENGTH = 5; // min length of username, password and email
const MAX_FIELD_LENGTH = 30;
const MAIL_SMTP_AUTH = JSON.parse(fs.readFileSync('./keys/smtp-auth.user', 'utf8'));
const MAIL_SMTP_CONFIG = {
  host: 'mail.mcgrandle.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: MAIL_SMTP_AUTH
};

// Database setup and check:
let db; // module scope needed, this variable used throughout the module.
require('./db-service') //db-service returns a promise which resolves to db object.
  .then(res => {     // once we have a valid db connection, check the data
    db = res; //store db in module-scope variable, then set up next promise in the chain:
    return db.collection('users').find({_id : 0}).limit(1).count(); // any users in db?
  })
  .then(res => {
    if (res === 0) { // if zero users in db, create defaults, otherwise, we're done.
      console.log(Date(Date.now()) + ' : created new "user" document in db.');
      let len;
      fs.readFile(DEFAULT_USERS, 'utf8') 
        .then(result => {
          const defUsers = JSON.parse(result);
          len = defUsers.length; //save for use in next promise result function
          return db.collection('users').insertMany(defUsers);
        })
        .then(result => {
          assert.equal(len, result.insertedCount); // checking creation was successful
          console.log('testing create result is good ...');
        })
        .catch(err => errAndExit(err, 1));
    }
  })
  .catch(err => errAndExit(err, 2));

exports.getUser = async function(user) {
  const userReturned = await db.collection('users').findOne({username : user.username});
  if (!userReturned) throw new Error('404 Unknown User.  Please try another username or register a new user.');
  return userReturned;
};

exports.getUserByEmail = async function(user) {
  const userReturned = await db.collection('users').findOne({email : user.email});
  if (!userReturned) throw new Error('404 Email address not found, did you type it correctly?');
  return userReturned;
};

exports.getId = async function(user) {
  const userReturned = await exports.getUser(user);
  return userReturned._id;
};

exports.getLevel = async function(user) {
  const userReturned = await exports.getUser(user);
  return userReturned.level;
};

exports.getListSansPasswords = async function() {
  const usersReturned = await db.collection('users').find({}).toArray();
  for (let i in usersReturned) { delete usersReturned[i].password; }
  return usersReturned;
};

exports.isValidLevel = async function(user, level) {
  const userReturned = await exports.getUser(user);
  if (userReturned.level == 0) throw new Error('401 User Deleted');
  if (userReturned.level == 1) throw new Error('401 User is not activated yet, please try again in a few hours.');
  for (let i=2;i<4;i++) {
    if ((userReturned.level == i) && (level > i)) {
      throw new Error('403 User ' + user.username + ' is not high enough level.')
    }
  }
  return true; // no errors thrown
};

exports.isValidPassword = async function(user) {
  const userReturned = await exports.getUser(user);
  if (user.password != userReturned.password) {
    throw new Error('401 Password incorrect, please try again.  If problem persists, please click the "forgot password" link.');
  }
  return true;
};

exports.isUnique = async function(user) {
  const userReturned = await db.collection('users').findOne({username : user.username});
  if (userReturned && (userReturned.level != 0)) { // it's okay if user found but deleted...
    throw new Error('403 Username already in use, please choose another one.');
  }
  return true;
};

exports.create = async function(user) {
  if (await isValidData(user)) {
    user.level = 1; // Users are created inactive
    let userReturned = await db.collection('users').findOne({level : 0});
    if (!userReturned) { // no deleted users, so create a new one
      let lastU = await db.collection('users').find().sort({_id: -1}).limit(1).next();
      user._id = lastU._id + 1;
      console.log('user to be inserted is ' + JSON.stringify(user));
      let r = await db.collection('users').insertOne(user);
    }
    else { //update the existing deleted user with new info
      user._id = userReturned._id;
      let r = await db.collection('users').replaceOne({_id: user._id}, user);
    }
  }
  delete user.password; // Delete password property so it isn't sent back
  return user;
};

exports.delete = async function(user) {
  if (user.username == "admin") throw new Error('403 Cannot delete admin user');
  const result = await db.collection('users').findOneAndUpdate(
    {username : user.username},
    {$set: {level: 0}}
  );
  if (result.lastErrorObject.n != 1) {
    throw new Error('404 Unknown User.  Please try another username or register a new user.');
  }
  return result.value;
};

exports.changePassword = async function(user) {
  const result = await db.collection('users').findOneAndUpdate(
    {username : user.username},
    {$set: {password: user.password}}
  );
  if (result.lastErrorObject.n != 1) {
    throw new Error('404 Unknown User.  Please try another username or register a new user.');
  }
  return result.value;
};

exports.emailReset = async function(user) {
  let token = await tokenSvc.getEmailChangeToken(user.username);
  let message = {
    from: 'webserver@mcgrandle.com',
    to: user.email,
    subject: 'Username or Password Forgotten',
    text: 'Dear ' + user.name + ',\n\n' + 'This is the reminder email ' + 'you requested.  Your username is "' +
      user.username + '".  To log in with this username, click the following link:\n\n' +  SERVER_URL +
      '/login\n\nIf however you have forgotten your password, then please click the following link to reset it.  ' +
      'Please note this link will expire in 1 hour.\n\n' + SERVER_URL + '/changepass/' + user.username +
      '/' + token + '\n\n' + 'Best regards,\n' + MAIL_SMTP_AUTH.user
  };
  let transporter = await nodemailer.createTransport(MAIL_SMTP_CONFIG);
  await transporter.sendMail(message);
  await transporter.close();
  return user;
};

// Internal functions:
isValidData = async function(user) {
// TODO: implement more complex validations
  for (i in user) {
    if (user[i].length < MIN_FIELD_LENGTH) {
      throw new Error('400 ' + i + ' too small: must be minimum '
        + MIN_FIELD_LENGTH + ' characters');
    }
    else if (user[i].length > MAX_FIELD_LENGTH) {
      throw new Error('400 ' + i + ' too large: must be maximum '
        + MAX_FIELD_LENGTH + ' characters');
    }
  }
  return true;
};

errAndExit = function(err, code) {
  console.log(err);
  process.exit(code);
};
