/* -------------------        err-service.js               -------------------
------------------------------------------------------------------------------*/

import { Response } from 'express';

export class ErrorService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public processError = (err: any, res: Response): void => {
        console.log(new Date().toLocaleString() + ' : ' + err.stack);
        const statusCode = Number(err.message.slice(0, 3));
        if (!statusCode) {
            res.status(500).send(
                'Server Error "' + err.message + '" - see server log for details'
            );
        } else {
            const msg = err.message.slice(4);
            res.status(statusCode).send(msg);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public exit = (err: any, code?: number): void => {
        console.log(err);
        process.exit(code);
    };
}

export const errSvc = new ErrorService();
