import { Request } from 'express';

export interface UserInterface {
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
    user?: UserInterface;
}

export class User implements UserInterface {
    public _id: number;
    public name: string;
    public username: string;
    public password?: string;
    public newPassword?: string;
    public email: string;
    public level: number;

    public constructor(user?: Partial<User>) {
        this._id = user && user._id !== undefined ? user._id : -1;
        this.name = user && user.name !== undefined ? user.name : '';
        this.username = user && user.username !== undefined ? user.username : '';
        this.password = user && user.password !== undefined ? user.password : undefined;
        this.newPassword =
            user && user.newPassword !== undefined ? user.newPassword : undefined;
        this.email = user && user.email !== undefined ? user.email : '';
        this.level = user && user.level !== undefined ? user.level : 0;
    }
}
