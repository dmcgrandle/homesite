// user-classes.ts - Declaration of User class
// Note - I have the constructors setting initial values so all instances
// are set up with fields in the same order every time.

export class User {
    _id: number;
    name: string;        // Full Name: eg: "John Doe"
    username: string;    // login name: eg: "john"
    password: string;
    email: string;
    level: number;

    constructor(iUser?: Partial<User>) {
        this._id = (iUser && iUser._id !== undefined) ? iUser._id : -1;
        this.name = (iUser && iUser.name !== undefined) ? iUser.name : '';
        this.username = (iUser && iUser.username !== undefined) ? iUser.username : '';
        this.password = (iUser && iUser.password !== undefined) ? iUser.password : '';
        this.email = (iUser && iUser.email !== undefined) ? iUser.email : '';
        this.level = (iUser && iUser.level !== undefined) ? iUser.level : 0;
    }
};

// server response classes - Declaration of responses from the server
export class LoginResponse {
    level: number;
    jwtToken: string;
    expiresAt: number;
};
