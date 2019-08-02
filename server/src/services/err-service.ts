/* -------------------        err-service.js               -------------------
------------------------------------------------------------------------------*/

import { Response } from 'express';

namespace es {
  export class ErrorService {

    processError = (err: any, res: Response) => {
      console.log((new Date()).toLocaleString() + ' : ' + err.stack);
      const statusCode = Number(err.message.slice(0, 3));
      if (!statusCode) {
        res.status(500).send('Server Error "' + err.message + '" - see server log for details');
      } else {
        const msg = err.message.slice(4);
        res.status(statusCode).send(msg);
      }
    };

    exit = (err: any, code?: number) => {
      //  throw new Error('001 Error connecting to database');
      console.log(err);
      process.exit(code);
    };

  }
}

export const errSvc = new es.ErrorService();
