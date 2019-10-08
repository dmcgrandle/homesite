/* token-service.js - provides authentication services */

// External Imports:
import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import { Options } from 'express-unless';

// let cfg: any;

// if (fs.existsSync('./config.js')) {
//   import('./config.js').then((importedCfg: any) => {
//     cfg = importedCfg.tokenService;
//     console.log('cfg in token.service is ', cfg);

const cfg = config.tokenService;

class TokenService {
  public getNew = async (uName: string): Promise<string> =>
    jwt.sign({ username: uName }, cfg.private_key, {
      algorithm: 'RS256',
      expiresIn: '1day'
    });

  public getEmailChangeToken = async (uName: string): Promise<string> =>
    jwt.sign({ username: uName }, cfg.email_secret, { expiresIn: '1hour' });

  public expiryTime = async (token: string): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decode: any = jwt.decode(token);
    if (decode) {
      return decode.exp;
    } else {
      return '';
    }
  };

  public verify = async (token: string): Promise<string | object> =>
    jwt.verify(token, cfg.public_key);

  public isValidEmailToken = async (token: string): Promise<boolean> => {
    try {
      jwt.verify(token, cfg.email_secret);
    } catch (err) {
      throw new Error('403 Invalid token');
    }
    return true;
  };

  public middlewareCheck = (unlessPath?: Options): expressJwt.RequestHandler | RequestHandler => {
    // Used in router.use middleware check.  'unlessPath' is an object specifying
    // any paths to EXCLUDE from the token check (no authentication needed).
    if (unlessPath) {
      return expressJwt({ secret: cfg.public_key }).unless(unlessPath);
    }
    return expressJwt({ secret: cfg.public_key });
  };
}
export const tokenSvc = new TokenService();

// Project Imports:
// import config from '../config';
// const cfg = config.tokenService;
