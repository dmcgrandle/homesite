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

    constructor() {
        this._id = -1;
        this.name = '';
        this.username = '';
        this.password = '';
        this.email = '';
        this.level = 0;
    }
};
