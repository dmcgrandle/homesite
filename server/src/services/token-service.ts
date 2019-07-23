/* token-service.js - provides authentication services */

// External Imports:
import * as fs from 'fs-extra';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import { Options } from 'express-unless';


// let cfg: any;

// if (fs.existsSync('./config.js')) {
//   import('./config.js').then((importedCfg: any) => {
//     cfg = importedCfg.tokenService;
//     console.log('cfg in token.service is ', cfg);

const cfg = config.tokenService;

namespace ts {
  export class TokenService {

    getNew = async (uName: string) => jwt.sign({ username: uName }, cfg.private_key,
      { algorithm: 'RS256', expiresIn: '1day' });
    
    getEmailChangeToken = async (uName: string) => jwt.sign({ username: uName },
        cfg.email_secret, { expiresIn: '1hour' });

    expiryTime = async (token: string) => {
      const decode: any = jwt.decode(token);
      if (decode) {
        return decode.exp;
      } else {
        return '';
      }
    };

    verify = async (token: string) => jwt.verify(token, cfg.public_key);

    isValidEmailToken = async (token: string) => {
      try {
        jwt.verify(token, cfg.email_secret);
      } catch (err) {
        throw new Error('403 Invalid token');
      }
      return true;
    };

    middlewareCheck = (unlessPath?: Options) => {
      // Used in router.use middleware check.  'unlessPath' is an object specifying
      // any paths to EXCLUDE from the token check (no authentication needed).
      if (unlessPath) {
        return expressJwt({ secret: cfg.public_key }).unless(unlessPath);
      }
      return expressJwt({ secret: cfg.public_key });
    };
  }
}
export const tokenSvc = new ts.TokenService();
  

// Project Imports:
// import config from '../config';
// const cfg = config.tokenService;
