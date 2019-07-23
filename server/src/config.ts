/* config.ts - main config for server in homesite */

// project imports
import { Config, SMTPAuth } from './model';

// global-requires used in this config file:
// let cfg: Config;
// let privateKey: string;
// let publicKey: string;
// let emailSecret: string;
// let smtpConfigAuth: SMTPAuth;

// const privateKey: string = require('./keys/jwtRS256.key').default;
// import('./keys/jwtRS256.key').then((data: any) => {
//   console.log('imported from jwtRS256.key', data);
//   privateKey = data.default;
//   return import('./keys/jwtRS256.key.pub');
// }).then((data) => {
//   console.log('imported from jwtRS256.key.pub', data);
//   publicKey = data.default;
//   return import('./keys/email-secret.key');
// }).then((data) => {
//   console.log('imported from email-secret.key', data);
//   emailSecret = data.default;
//   return import('./keys/smtp-auth.user');
// }).then((data) => {
//   console.log('imported from smtp-auth.user', data);
//   smtpConfigAuth = data.default;

// const publicKey: string = require('./keys/jwtRS256.key.pub');
// const emailSecret: string = require('./keys/email-secret.key');
// const smtpConfigAuth: SMTPAuth = require('./keys/smtp-auth.user');

// global config variable to add all config objects to

async function initConfig(): Promise<Config> {
  return ({
    dbService: {
      db_url: 'mongodb://localhost:27017',
      db_name: 'homesite',
    },
    tokenService: {
      private_key: (await import('./keys/jwtRS256.key')).default,
      public_key: (await import('./keys/jwtRS256.key.pub')).default,
      email_secret: (await import('./keys/email-secret.key')).default,
    },
    userService: {
      DB_COLLECTION_NAME: 'users',
      PW_SECRET: 'SuperSecret', // must match client/src/assets/config/config.prod.json -> login.password_secret
      SALT_ROUNDS: 8, // see "A Note on Rounds" here: https://www.npmjs.com/package/bcrypt before changing
      server_url: 'http://localhost:3000',
      default_users: './default-users.json',
      min_field_length: 5,
      max_field_length: 60,
      mail: {
        smtp_config: {
          host: 'mail.mcgrandle.com',
          port: 587,
          secure: false,
          auth: (await import('./keys/smtp-auth.user')).default,
        },
      },
    },
    fileService : {},
    mediaService: {
      PHOTO_DIR: {
        PATH: '/protected/images/', // Note: the trailing slash is important ...
        CACHE_DIR: '.cache',
      },
      VIDEO_DIR: {
        PATH: '/protected/videos/',
        CACHE_DIR: '.cache',
      },
      THUMBS: {
        // Note: currently homesite displays thumbs only (no large image)
        // to users with screen resolution < 600px (mobile devices), so
        // setting WIDTH: 600 would give them full res images, however it
        // would also dramatically increase the size of the thumbnails ...
        WIDTH: 300, // height will depend on aspect ratio
        FORMAT: 'jpeg',
        PREFIX: 'thumb', // prefix for each file, eg: thumb-f5f15876.jpg
        SUFFIX: '.jpg', // suffix - change to match FORMAT above
        MAX_CREATE_AT_ONCE: 50, // limit for constrained env, eg: Raspberry Pi
      },
      POSTERS: { // poster image to display for video file
        WIDTH: 600,
        FORMAT: 'jpeg',
        PREFIX: 'thumb',
        SUFFIX: '.jpg',
        MAX_CREATE_AT_ONCE: 20,
      },
    },
    downloadService: {
      DB_COLLECTION_NAME: 'downloads',
      DOWNLOAD_DIR: {
        PATH: '/protected/downloads/',
        CACHE_DIR: '.cache',
      },
      TYPE_DESCRIPTION_DB: './file-type-description.txt',
      USE_SI_SIZE: true, // http://www.kossboss.com/?p=2234
    }
  });
}

export default initConfig();
