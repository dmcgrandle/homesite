/* users-api.ts - router for '/api/users' path API */

// External Imports:
import * as express from 'express';
import { Response } from 'express';
import * as bodyParser from 'body-parser';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Project Imports:
import { RequestWithUser, User } from 'src/model';
import { tokenSvc } from '../services/token-service';
import { userSvc } from '../services/user-service';
import { errSvc } from '../services/err-service';

// define a router to configure and export:
const router = express.Router();

// middleware that is specific to this router
router.use(
    (req, res, next): void => {
        console.log(
            `${new Date().toLocaleString()} : Login API called - '${req.originalUrl}'`
        );
        next();
    }
);
// This next call checks for a valid jwt token, needed for ALL calls to /users
// EXCEPT for calls to /users/login (since logging in gets the token ...)
// and for calls to /users/create (since client will create new inactive user
// who then must be activated by an admin to then finally login and get a token)
// and to /users/forgot since they need to reset password to login again
router.use(
    tokenSvc.middlewareCheck({
        path: [
            '/api/users/login',
            '/api/users/create',
            '/api/users/forgot',
            '/api/users/changepw-by-token'
        ]
    })
);
router.use(bodyParser.json());

/* POST /login user for authentication. */
router.post('/login', (req: RequestWithUser, res: Response): void => {
    // let id = -1;
    let token = '';
    let lvl = 0; // setup default invalid values
    userSvc
        .isValidLevel(req.body, 2) // min level 2 to log in
        .then((): Promise<boolean> => userSvc.isValidPassword(req.body))
        .then((): Promise<string> => tokenSvc.getNew(req.body.username))
        .then((tkn): Promise<number> => {
            token = tkn;
            return userSvc.getLevel(req.body);
        })
        .then((level): Promise<string> => {
            lvl = level;
            return tokenSvc.expiryTime(token);
        })
        .then((expiry): void => {
            // All values now verified - construct response to client
            console.log('Successful login for user: ' + req.body.username);
            res.status(200).json({
                // set up info returned to client on login
                jwtToken: token,
                level: lvl,
                expiresAt: expiry
            });
        })
        .catch((err): void => errSvc.processError(err, res));
});

/* POST /create to create new user. */
router.post('/create', (req: RequestWithUser, res: Response): void => {
    userSvc
        .isUnique(req.body)
        .then((): Promise<User> => userSvc.create(req.body))
        .then((newUser: User): Response => res.status(201).json(newUser))
        .catch((err): void => errSvc.processError(err, res));
});

/* PUT /update to update existing user data */
router.put('/update', (req: RequestWithUser, res: Response): void => {
    userSvc
        .isValidLevel(req.user, 4)
        .then((): Promise<User | null> => userSvc.update(req.body))
        .then((user: User | null): Response => res.status(201).json(user))
        .catch((err): void => errSvc.processError(err, res));
});

/* POST /forgot to reset password for a user. */
router.post('/forgot', (req: RequestWithUser, res: Response): void => {
    userSvc
        .getUserByEmail(req.body)
        .then((userReturned: User): Promise<User> => userSvc.emailReset(userReturned))
        .then((emailedUser: User): Response => res.status(201).json(emailedUser))
        .catch((err): void => errSvc.processError(err, res));
});

/* change password using token sent via email */
router.post('/changepw-by-token', (req: RequestWithUser, res: Response): void => {
    tokenSvc
        .isValidEmailToken(req.body.token)
        .then((): Promise<User> => userSvc.changePassword(false, req.body))
        .then((user: User): Response => res.status(201).json(user))
        .catch((err): void => errSvc.processError(err, res));
});

/* change password using existing password */
router.post('/changepw-by-pw', (req: RequestWithUser, res: Response): void => {
    userSvc
        .isValidLevel(req.user, 2)
        .then((): Promise<User> => userSvc.changePassword(true, req.body))
        .then((user: User): Response => res.status(201).json(user))
        .catch((err): void => errSvc.processError(err, res));
});

/* DELETE /one to delete a single user.  Needs level 4+ access */
router.delete('/one', (req: RequestWithUser, res: Response): void => {
    userSvc
        .isValidLevel(req.user, 4) // check username in jwt token for level
        .then((): Promise<User> => userSvc.delete(req.body))
        .then((delUser: User): Response =>
            res.status(200).send('user ' + delUser.username + ' is deleted')
        )
        .catch((err): void => errSvc.processError(err, res));
});

/**
 * GET list of users
 * @remarks
 *
 * Set up an API GET response for '/api/list' that returns an array of Users
 *
 * @callback - validates user level, gets user list and sends back to client.
 */
router.get('/list', (req: RequestWithUser, res: Response): void => {
    userSvc
        .errIfNotValidLevel(req.user, 4)
        .pipe(switchMap((): Observable<User[]> => userSvc.getListSansPasswords()))
        .subscribe(
            (userList): Response => res.status(200).json(userList),
            (err): void => errSvc.processError(err, res)
        );
});

/* Logout is now done in the client, server is stateless
router.put('/logout', function (req, res, next) {
  // note: express-jwt has decoded the token and put info into req.user
  console.log('req.user: ' + JSON.stringify(req.user));
  next();
}); */

export default router;
