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
const bcrypt = require('bcrypt');
const cryptoTS = require('crypto-ts');

// Project Imports:
const cfg = require('../config').userService;
const tokenSvc = require('./token-service');
const dbSvc = require('./db-service');
const errSvc = require('./err-service');

/* eslint-disable no-use-before-define */ // Want to put this iife at top of file
let db; // module scope needed
(async () => { // set up module-scope variables asynchronously.
  try { // if errors then crash
    db = await dbSvc.database;
    if (await db.collection(cfg.DB_COLLECTION_NAME).find({ _id: 0 }).limit(1).count() === 0) {
      const defUsers = JSON.parse(await fs.readFile(cfg.default_users, 'utf8'));
      // Set up promise array to iterate through all defUsers and hash the passwords
      const pArray = [];
      for (let i = 0; i < defUsers.length; i += 1) {
        pArray[i] = bcrypt.hash(defUsers[i].password, cfg.SALT_ROUNDS);
      }
      const hashArray = await Promise.all(pArray);
      for (let i = 0; i < hashArray.length; i += 1) {
        defUsers[i].password = hashArray[i];
      }
      const res = await db.collection(cfg.DB_COLLECTION_NAME).insertMany(defUsers);
      assert.equal(defUsers.length, res.insertedCount); // checking creation was successful
      console.log(Date(Date.now()) + ' : created new "user" document in db.');
    }
  } catch (err) { errSvc.exit(err, 1); }
})(); // IIFE
/* eslint-enable no-use-before-define */

// Internal functions:

function decryptPw(pw) { // decrypt password sent from client, return plain text string
  return cryptoTS.AES.decrypt(pw, cfg.PW_SECRET).toString(cryptoTS.enc.Utf8);
}

function isValidData(user) {
  // TODO: implement more complex validations
  const keys = Object.keys(user);
  const values = Object.values(user);
  values.forEach((value, index) => {
    if (value.length < cfg.min_field_length) {
      throw new Error('400 ' + keys[index] + ' too small: must be minimum '
        + cfg.min_field_length + ' characters');
    } else if (value.length > cfg.max_field_length) {
      throw new Error('400 ' + keys[index] + ' too large: must be maximum '
        + cfg.max_field_length + ' characters');
    }
  });
  return true;
}

function checkAndArrangeUserObject(user) {
  // The purpose of this function is to make sure all the keys and values in
  // the user object appear in the correct order - we could be sent the values
  // in any order, so this arranges them properly.
  const newUser = {};
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

// Exportable functions:

exports.getUser = async (userName) => {
  const userReturned = await db.collection(cfg.DB_COLLECTION_NAME).findOne({ username: userName });
  if (!userReturned) throw new Error('404 Unknown User.  Please try another username or register a new user.');
  return userReturned;
};

exports.getUserById = async (id) => {
  const userReturned = await db.collection(cfg.DB_COLLECTION_NAME).findOne({ _id: id });
  if (!userReturned) throw new Error('404 Unknown User.  Please try another username or register a new user.');
  return userReturned;
};

exports.getUserByEmail = async (user) => {
  const userReturned = await db.collection(cfg.DB_COLLECTION_NAME).findOne({ email: user.email });
  if (!userReturned) throw new Error('404 Email address not found, did you type it correctly?');
  return userReturned;
};

exports.getId = async (user) => {
  const userReturned = await exports.getUser(user.username);
  return userReturned._id;
};

exports.getLevel = async (user) => {
  const userReturned = await exports.getUser(user.username);
  return userReturned.level;
};

exports.getListSansPasswords = async () => {
  const usersReturned = await db.collection(cfg.DB_COLLECTION_NAME).find({}).toArray();
  /* eslint-disable-next-line no-param-reassign */
  usersReturned.forEach(user => delete user.password);
  return usersReturned;
};

exports.isValidLevel = async (user, level) => {
  const userReturned = await exports.getUser(user.username);
  if (userReturned.level === 0) throw new Error('401 User Deleted');
  if (userReturned.level === 1) throw new Error('401 User is not activated yet, please try again in a few hours.');
  if (userReturned.level < level) throw new Error('403 User ' + user.username + ' is not high enough level.');
  return true; // no errors thrown
};

exports.testLevelForUpload = (req, res, next) => {
  // Middleware function to test the user level for upload
  exports.isValidLevel(req.user, 3)
    .then(() => next())
    .catch(err => errSvc.processError(err, res));
};

exports.isValidPassword = async (user) => {
  const dbUser = await exports.getUser(user.username);
  if (!(await bcrypt.compare(decryptPw(user.password), dbUser.password))) {
    throw new Error('401 Password incorrect, please try again.  If problem persists, please click the "forgot password" link.');
  }
  return true;
};

exports.isUnique = async (user) => {
  const userReturned = await db.collection(cfg.DB_COLLECTION_NAME)
    .findOne({ username: user.username });
  if (userReturned && (userReturned.level !== 0)) { // it's okay if user found but deleted...
    throw new Error('403 Username already in use, please choose another one.');
  }
  return true;
};

exports.create = async (passedUser) => {
  const user = passedUser;
  if (await isValidData(user)) {
    user.level = 1; // Users are created inactive
    user.password = await bcrypt.hash(decryptPw(user.password), cfg.SALT_ROUNDS);
    const userReturned = await db.collection(cfg.DB_COLLECTION_NAME).findOne({ level: 0 });
    if (!userReturned) { // no deleted users, so create a new one
      const lastU = await db.collection(cfg.DB_COLLECTION_NAME).find().sort({ _id: -1 }).limit(1)
        .next();
      user._id = lastU._id + 1;
      await db.collection(cfg.DB_COLLECTION_NAME).insertOne(user);
    } else { // update the existing deleted user with new info
      user._id = userReturned._id;
      await db.collection(cfg.DB_COLLECTION_NAME).replaceOne({ _id: user._id }, user);
    }
  }
  delete user.password; // Delete password property so it isn't sent back
  return user;
};

exports.delete = async (user) => {
  if (user.username === 'admin') throw new Error('403 Cannot delete admin user');
  const result = await db.collection(cfg.DB_COLLECTION_NAME).findOneAndUpdate(
    { username: user.username },
    { $set: { level: 0 } },
  );
  if (result.lastErrorObject.n !== 1) {
    throw new Error('404 Unknown User.  Please try another username or register a new user.');
  }
  return result.value;
};

exports.update = async (passedUser) => { // user._id is the only uneditable field ...
  const user = passedUser;
  if (await isValidData(user)) {
    const userById = await exports.getUserById(user._id); // because the username may change ...
    const userByUsername = await db.collection(cfg.DB_COLLECTION_NAME)
      .findOne({ username: user.username });
    //    const userByUsername = await exports.getUser(user.username);
    if (userByUsername && (userById._id !== userByUsername._id)) {
      throw new Error('403 Username already in use, please choose another one.');
    } else {
      if (user.password) { // if password object exists then use new password sent
        user.password = await bcrypt.hash(decryptPw(user.password), cfg.SALT_ROUNDS);
      } else { // keep the password the same
        user.password = userById.password;
      }
      await db.collection(cfg.DB_COLLECTION_NAME).replaceOne({ _id: user._id },
        checkAndArrangeUserObject(user));
    }
    delete user.password; // Delete password property so it isn't sent back
    return user;
  }
  return null;
};


exports.changePassword = async (changeByExisting, userPassed) => {
  // This method can be called two ways:
  // 1. User could be using a token to change the existing password (as the result of a
  // "forgot password" email), or
  // 2. User could be using their existing (old) password to authorize a change.  In this case,
  // the userPassed object must have a 'newPassword' property with the new password in it.
  const user = userPassed;
  if (changeByExisting && (await exports.isValidPassword(user))) {
    user.password = await bcrypt.hash(decryptPw(user.newPassword), cfg.SALT_ROUNDS);
  } else { // if changing by token then user.password has the new password in it.
    user.password = await bcrypt.hash(decryptPw(user.password), cfg.SALT_ROUNDS);
  }
  const result = await db.collection(cfg.DB_COLLECTION_NAME).findOneAndUpdate(
    { username: user.username },
    { $set: { password: user.password } },
  );
  if (result.lastErrorObject.n !== 1) {
    throw new Error('404 Unknown User.  Please try another username or register a new user.');
  }
  console.log('Changed password for user', result.value.username);
  delete result.value.password; // Remove password from returned user
  return result.value;
};

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

exports.emailReset = async (user) => {
  const token = await tokenSvc.getEmailChangeToken(user.username);
  await delay(130000);
  const message = {
    from: cfg.mail.smtp_config.auth.user,
    to: user.email,
    subject: 'Username or Password Forgotten',
    /* eslint-disable no-useless-concat */
    text: 'Dear ' + user.name + ',\n\n' + 'This is the reminder email ' + 'you requested.  Your username is "'
      + user.username + '".  To log in with this username, click the following link:\n\n' + cfg.server_url
      + '/login\n\nIf however you have forgotten your password, then please click the following link to reset it.  '
      + 'Please note this link will expire in 1 hour.\n\n' + cfg.server_url + '/changepass/' + user.username
      + '/' + token + '\n\n' + 'Best regards,\n' + cfg.mail.smtp_config.auth.user,
    /* eslint-enable no-useless-concat */
  };
  const transporter = await nodemailer.createTransport(cfg.mail.smtp_config);
  await transporter.sendMail(message);
  await transporter.close();
  return user;
};
