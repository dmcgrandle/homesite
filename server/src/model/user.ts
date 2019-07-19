import { Request } from 'express';

export interface User {
    _id: number;
    name: string;
    username: string;
    password?: string;
    newPassword?: string;
    email: string;
    level: number;
}

export interface SMTPAuth {
    user: string;
    pass: string;
}

// we add a user property to the req object with token middleware, so allow it in Request object.
export interface RequestWithUser extends Request {
    user?: User;
  }
  