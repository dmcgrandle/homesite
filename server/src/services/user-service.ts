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
import { Db } from 'mongodb';
import { Response } from 'express';
import * as fs from 'fs-extra';
import * as assert from 'assert';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import * as cryptoTS from 'crypto-ts';
// import Debug from 'debug';
import { Observable, from, throwError, of } from 'rxjs';
import { switchMap, map, throwIfEmpty, concatAll, toArray } from 'rxjs/operators';

// Project Imports:
import { RequestWithUser, User } from '../model';
import { database } from './db-service';
import { tokenSvc } from './token-service';
import { errSvc } from './err-service';

// Constants:
// const debug = Debug('homesite:user-service');
const cfg = config.userService;

class UserService {
  // need the bang (!) to stop typescript from complaining that the assignment is inside a try block
  private db!: Db;

  public async init(): Promise<void> {
    try {
      this.db = await database;
      if (
        (await this.db
          .collection(cfg.DB_COLLECTION_NAME)
          .find({ _id: 0 })
          .limit(1)
          .count()) === 0
      ) {
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
        const res = await this.db.collection(cfg.DB_COLLECTION_NAME).insertMany(defUsers);
        assert.equal(defUsers.length, res.insertedCount); // checking creation was successful
        console.log(new Date().toLocaleString() + ' : created new "user" document in db.');
      }
    } catch (err) {
      errSvc.exit(err, 1);
    }
  }

  private decryptPw(pw: string): string {
    // decrypt password sent from client, return plain text string
    return cryptoTS.AES.decrypt(pw, cfg.PW_SECRET).toString(cryptoTS.enc.Utf8);
  }

  private isValidData(user: User): boolean {
    // TODO: implement more complex validations
    const keys = Object.keys(user);
    const values = Object.values(user);
    values.forEach((value, index): void => {
      if (value.length < cfg.min_field_length) {
        throw new Error(
          '400 ' +
            keys[index] +
            ' too small: must be minimum ' +
            cfg.min_field_length +
            ' characters'
        );
      } else if (value.length > cfg.max_field_length) {
        throw new Error(
          '400 ' +
            keys[index] +
            ' too large: must be maximum ' +
            cfg.max_field_length +
            ' characters'
        );
      }
    });
    return true;
  }

  private checkAndArrangeUserObject(user: User): User {
    // The purpose of this function is to make sure all the keys and values in
    // the user object appear in the correct order - we could be sent the values
    // in any order, so this arranges them properly.
    if (user._id < 0) throw new Error('404 Unknown UserId: ' + user._id);
    if (!user.name) throw new Error('404 Unknown Name: ' + user.name);
    if (!user.username) throw new Error('404 Unknown Username: ' + user.username);
    if (!user.password) throw new Error('404 Password must be present');
    if (!user.email) throw new Error('404 Email must be present');
    if (user.level < 0 || user.level > 4) throw new Error('404 Level not valid: ' + user.level);
    const newUser: User = {
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.password,
      email: user.email,
      level: user.level
    };
    return newUser;
  }

  // Public methods:

  public getUser = async (username: string): Promise<User> => {
    const userReturned = await this.db
      .collection(cfg.DB_COLLECTION_NAME)
      .findOne({ username: username });
    if (!userReturned)
      throw new Error('404 Unknown User.  Please try another username or register a new user.');
    return userReturned;
  };

  public rxGetUser = (username: string): Observable<User> => {
    return from(this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ username: username })).pipe(
      throwIfEmpty(
        (): Error =>
          new Error('404 Unknown User.  Please try another username or register a new user.')
      )
    );
  };

  public getUserById = async (id: number): Promise<User> => {
    const userReturned = await this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ _id: id });
    if (!userReturned)
      throw new Error('404 Unknown User.  Please try another username or register a new user.');
    return userReturned;
  };

  public getUserByEmail = async (user: User): Promise<User> => {
    const userReturned = await this.db
      .collection(cfg.DB_COLLECTION_NAME)
      .findOne({ email: user.email });
    if (!userReturned) throw new Error('404 Email address not found, did you type it correctly?');
    return userReturned;
  };

  public getId = async (user: User): Promise<number> => {
    const userReturned = await this.getUser(user.username);
    return userReturned._id;
  };

  public getLevel = async (user: User): Promise<number> => {
    const userReturned = await this.getUser(user.username);
    return userReturned.level;
  };

  private removePassword(user: User): User {
    const copyUser = new User(user);
    delete copyUser.password;
    return copyUser;
  }

  /**  */
  public getListSansPasswords(): Observable<User[]> {
    return from(
      this.db
        .collection<User>(cfg.DB_COLLECTION_NAME)
        .find({})
        .toArray()
    ).pipe(
      concatAll(), // flatten the array - ie: emit each user individually
      map((user): User => this.removePassword(user)),
      toArray() // gather all users back into an array again
    );
  }

  public isValidLevel = async (user: User | undefined, level: number): Promise<void> => {
    if (!user) {
      throw new Error('404 No User given');
    }
    const userReturned = await this.getUser(user.username);
    if (userReturned.level === 0) throw new Error('401 User Deleted');
    if (userReturned.level === 1)
      throw new Error('401 User is not activated yet, please try again in a few hours.');
    if (userReturned.level < level)
      throw new Error('403 User ' + user.username + ' is not high enough level.');
  };

  public errIfNotValidLevel = (user: User | undefined, level: number): Observable<User> => {
    if (!user) {
      return throwError(new Error('404 No User given'));
    }
    return this.rxGetUser(user.username).pipe(
      switchMap(
        (user): Observable<User> => {
          if (user.level === 0) {
            return throwError(new Error(`401 User ${user.username} has been Deleted`));
          } else if (user.level === 1) {
            return throwError(
              new Error(`401 User is not activated yet, please try again in a few hours.`)
            );
          } else if (user.level < level) {
            return throwError(new Error(`403 User ${user.username} is not high enough level.`));
          } else {
            return of(user);
          }
        }
      )
    );
  };

  public testLevelAtOrAbove3 = (req: RequestWithUser, res: Response, next: Function): void => {
    // Middleware function to test the user level is at or above 3.  Wrapper around 'isValidLevel()'
    this.isValidLevel(req.user, 3)
      .then((): void => next())
      .catch((err): void => errSvc.processError(err, res));
  };

  public isValidPassword = async (user: User): Promise<boolean> => {
    const dbUser = await this.getUser(user.username);
    if (user.password && !(await bcrypt.compare(this.decryptPw(user.password), dbUser.password))) {
      throw new Error(
        '401 Password incorrect, please try again.  If problem persists, please click the "forgot password" link.'
      );
    }
    return true;
  };

  public isUnique = async (user: User): Promise<boolean> => {
    const userReturned = await this.db
      .collection(cfg.DB_COLLECTION_NAME)
      .findOne({ username: user.username });
    if (userReturned && userReturned.level !== 0) {
      // it's okay if user found but deleted...
      throw new Error('403 Username already in use, please choose another one.');
    }
    return true;
  };

  public create = async (passedUser: User): Promise<User> => {
    const user = passedUser;
    if (await this.isValidData(user)) {
      user.level = 1; // Users are created inactive
      if (user.password) {
        user.password = await bcrypt.hash(this.decryptPw(user.password), cfg.SALT_ROUNDS);
      }
      const userReturned = await this.db.collection(cfg.DB_COLLECTION_NAME).findOne({ level: 0 });
      if (!userReturned) {
        // no deleted users, so create a new one
        const lastU = await this.db
          .collection(cfg.DB_COLLECTION_NAME)
          .find()
          .sort({ _id: -1 })
          .limit(1)
          .next();
        user._id = lastU._id + 1;
        await this.db.collection(cfg.DB_COLLECTION_NAME).insertOne(user);
      } else {
        // update the existing deleted user with new info
        user._id = userReturned._id;
        await this.db.collection(cfg.DB_COLLECTION_NAME).replaceOne({ _id: user._id }, user);
      }
    }
    delete user.password; // Delete password property so it isn't sent back
    return user;
  };

  public delete(user: User): Observable<User> {
    if (user.username === 'admin') throw new Error('403 Cannot delete admin user');
    return from(
      this.db
        .collection(cfg.DB_COLLECTION_NAME)
        .findOneAndUpdate({ username: user.username }, { $set: { level: 0 } })
    ).pipe(
      map(
        (result): User => {
          if (result.lastErrorObject.n !== 1) {
            throw new Error(
              '404 Unknown User.  Please try another username or register a new user.'
            );
          }
          return result.value;
        }
      )
    );
  }

  public update = async (passedUser: User): Promise<User | null> => {
    // user._id is the only uneditable field ...
    const user = passedUser;
    if (await this.isValidData(user)) {
      const userById = await this.getUserById(user._id); // because the username may change ...
      const userByUsername = await this.db
        .collection(cfg.DB_COLLECTION_NAME)
        .findOne({ username: user.username });
      //    const userByUsername = await getUser(user.username);
      if (userByUsername && userById._id !== userByUsername._id) {
        throw new Error('403 Username already in use, please choose another one.');
      } else {
        if (user.password) {
          // if password object exists then use new password sent
          user.password = await bcrypt.hash(this.decryptPw(user.password), cfg.SALT_ROUNDS);
        } else {
          // keep the password the same
          user.password = userById.password;
        }
        await this.db
          .collection(cfg.DB_COLLECTION_NAME)
          .replaceOne({ _id: user._id }, this.checkAndArrangeUserObject(user));
      }
      delete user.password; // Delete password property so it isn't sent back
      return user;
    }
    return null;
  };

  public changePassword = async (changeByExisting: boolean, userPassed: User): Promise<User> => {
    // This method can be called two ways:
    // 1. User could be using a token to change the existing password (as the result of a
    // "forgot password" email), or
    // 2. User could be using their existing (old) password to authorize a change.  In this case,
    // the userPassed object must have a 'newPassword' property with the new password in it.
    const user = userPassed;
    if (changeByExisting && (await this.isValidPassword(user)) && user.newPassword) {
      user.password = await bcrypt.hash(this.decryptPw(user.newPassword), cfg.SALT_ROUNDS);
    } else if (user.password) {
      // if changing by token then user.password has the new password in it.
      user.password = await bcrypt.hash(this.decryptPw(user.password), cfg.SALT_ROUNDS);
    } else {
      throw new Error('401 Error - password not given');
    }
    const result = await this.db
      .collection(cfg.DB_COLLECTION_NAME)
      .findOneAndUpdate({ username: user.username }, { $set: { password: user.password } });
    if (result.lastErrorObject.n !== 1) {
      throw new Error('404 Unknown User.  Please try another username or register a new user.');
    }
    console.log('Changed password for user', result.value.username);
    delete result.value.password; // Remove password from returned user
    return result.value;
  };

  // private delay(timeout: number): Promise<void> {
  //   return new Promise((resolve): number => setTimeout(resolve, timeout));
  // }

  public emailReset = async (user: User): Promise<User> => {
    const token = await tokenSvc.getEmailChangeToken(user.username);
    // await this.delay(130000);
    const message = {
      from: cfg.mail.smtp_config.auth.user,
      to: user.email,
      subject: 'Username or Password Forgotten',
      text: `Dear ${user.name},

This is the reminder email you requested.  Your username is ${user.username}.
To log in with this username, click the following link:

${cfg.server_url}/user/login

If however you have forgotten your password, then please click the following link to reset it.
Please note this link will expire in 1 hour.

${cfg.server_url}/user/changepass/${user.username}/${token}

Best regards,
${cfg.mail.smtp_config.auth.user}
`
    };
    const transporter = await nodemailer.createTransport(cfg.mail.smtp_config);
    await transporter.sendMail(message);
    await transporter.close();
    return user;
  };
}

export const userSvc = new UserService();
userSvc.init();
