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
const bcrypt = require('bcrypt');
const cryptoTS = require('crypto-ts');

// Project Imports:
const cfg = require('../config').userService;
const tokenSvc = require('./token-service');

// Set up db for database access:
let db; // module scope needed, these variables are used throughout the module.
(async function() { // set up module-scope variables asynchronously.
  try { // if errors then crash
    db = await require('./db-service');
    if (0 === await db.collection('users').find({_id : 0}).limit(1).count()) {
      const defUsers = JSON.parse(await fs.readFile(cfg.default_users, 'utf8'));
      // Set up promise array to iterate through all defUsers and hash the passwords
      let pArray = [];
      for (let i=0;i<defUsers.length;i++) {
        pArray[i] = bcrypt.hash(defUsers[i].password, cfg.SALT_ROUNDS);
      }
      let hashArray = await Promise.all(pArray);
      for (let i=0;i<hashArray.length;i++) {
        defUsers[i].password = hashArray[i];
      }
      const res = await db.collection('users').insertMany(defUsers);
      assert.equal(defUsers.length, res.insertedCount); // checking creation was successful   
      console.log(Date(Date.now()) + ' : created new "user" document in db.');
    }
  }
  catch(err) {errAndExit(err, 1)}; 
})(); // IIFE 


exports.getUser = async function(username) {
  const userReturned = await db.collection('users').findOne({username : username});
  if (!userReturned) throw new Error('404 Unknown User.  Please try another username or register a new user.');
  return userReturned;
};

exports.getUserById = async function(id) {
  const userReturned = await db.collection('users').findOne({_id : id});
  if (!userReturned) throw new Error('404 Unknown User.  Please try another username or register a new user.');
  return userReturned;
};


exports.getUserByEmail = async function(user) {
  const userReturned = await db.collection('users').findOne({email : user.email});
  if (!userReturned) throw new Error('404 Email address not found, did you type it correctly?');
  return userReturned;
};

exports.getId = async function(user) {
  const userReturned = await exports.getUser(user.username);
  return userReturned._id;
};

exports.getLevel = async function(user) {
  const userReturned = await exports.getUser(user.username);
  return userReturned.level;
};

exports.getListSansPasswords = async function() {
  const usersReturned = await db.collection('users').find({}).toArray();
  for (let i in usersReturned) { delete usersReturned[i].password; }
  return usersReturned;
};

exports.isValidLevel = async function(user, level) {
  const userReturned = await exports.getUser(user.username);
  if (userReturned.level === 0) throw new Error('401 User Deleted');
  if (userReturned.level === 1) throw new Error('401 User is not activated yet, please try again in a few hours.');
  if (userReturned.level < level) throw new Error('403 User ' + user.username + ' is not high enough level.');
  return true; // no errors thrown
};

exports.isValidPassword = async function(user) {
  const dbUser = await exports.getUser(user.username);
  if (!(await bcrypt.compare(decryptPw(user.password), dbUser.password))) {
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
    user.password = await bcrypt.hash(decryptPw(user.password), cfg.SALT_ROUNDS);
    let userReturned = await db.collection('users').findOne({level : 0});
    if (!userReturned) { // no deleted users, so create a new one
      let lastU = await db.collection('users').find().sort({_id: -1}).limit(1).next();
      user._id = lastU._id + 1;
      await db.collection('users').insertOne(user); 
    }
    else { //update the existing deleted user with new info
      user._id = userReturned._id;
      await db.collection('users').replaceOne({_id: user._id}, user);
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

exports.update = async function(user) {// user._id is the only uneditable field ...
  if (await isValidData(user)) {
    const userReturned = await exports.getUserById(user._id); // because the username may change ...
    if (user.password){// if password object exists then use new password sent
      user.password = await bcrypt.hash(decryptPw(user.password), cfg.SALT_ROUNDS);
    } else {// keep the password the same
      user.password = userReturned.password;
    }
    await db.collection('users').replaceOne({_id: user._id}, checkAndArrangeUserObject(user));
  }
  delete user.password; // Delete password property so it isn't sent back
  return user;
};


exports.changePassword = async function(changeByExisting, user) {
  if (changeByExisting && (await exports.isValidPassword(user))) {// user object must have newPassword property
      user.password = await bcrypt.hash(decryptPw(user.newPassword), cfg.SALT_ROUNDS);
  }
  else { // if changing by token then user.password has the new password in it.
    user.password = await bcrypt.hash(decryptPw(user.password), cfg.SALT_ROUNDS);
  }
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
    from: cfg.mail.smtp_config.auth.user,
    to: user.email,
    subject: 'Username or Password Forgotten',
    text: 'Dear ' + user.name + ',\n\n' + 'This is the reminder email ' + 'you requested.  Your username is "' +
      user.username + '".  To log in with this username, click the following link:\n\n' +  cfg.server_url +
      '/login\n\nIf however you have forgotten your password, then please click the following link to reset it.  ' +
      'Please note this link will expire in 1 hour.\n\n' + cfg.server_url + '/changepass/' + user.username +
      '/' + token + '\n\n' + 'Best regards,\n' + cfg.mail.smtp_config.auth.user
  };
  let transporter = await nodemailer.createTransport(cfg.mail.smtp_config);
  await transporter.sendMail(message);
  await transporter.close();
  return user;
};

// Internal functions:

decryptPw = function(pw) { // decrypt password sent from client, return plain text string
  return cryptoTS.AES.decrypt(pw, cfg.PW_SECRET).toString(cryptoTS.enc.Utf8);
}

isValidData = async function(user) {
// TODO: implement more complex validations
  for (i in user) {
    if (user[i].length < cfg.min_field_length) {
      throw new Error('400 ' + i + ' too small: must be minimum '
        + cfg.min_field_length + ' characters');
    }
    else if (user[i].length > cfg.max_field_length) {
      throw new Error('400 ' + i + ' too large: must be maximum '
        + cfg.max_field_length + ' characters');
    }
  }
  return true;
};

checkAndArrangeUserObject = function(user) {
  // The purpose of this function is to make sure all the keys and values in
  // the user object appear in the correct order - we could be sent the values
  // in any order, so this arranges them properly.
  let newUser = {};
  if (user._id < 0) throw new Error('404 Unknown UserId: ' + user._id);
  if (!user.name) throw new Error('404 Unknown Name: ' + user.name);
  if (!user.username) throw new Error('404 Unknown Username: ' + user.username);
  if (!user.password) throw new Error('404 Password must be present');
  if (!user.email) throw new Error('404 Email must be present');
  if ((user.level < 0) || (user.level > 4)) throw new Error('404 Level not valid: ' + user.level);
  newUser._id = user._id;
  newUser.name = user.name;
  newUser.username = user.username;
  newUser.password = user.password;
  newUser.email = user.email;
  newUser.level = user.level;
  return newUser;
}

errAndExit = function(err, code) {
//  throw new Error('001 Error connecting to database');
  console.log(err);
  process.exit(code);
};
