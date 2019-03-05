export interface IAppConfig {
    env: {
        name: string;
    };
    header: {
        title: string;
    };
    footer: {
        title: string;
        email: string;
    };
    home: {
        background: string;
    };
    login: {
        title: string;
    };
    auth: {
        password_secret: string;
    };
    about: {
        family: {
            name: string;
            members: Person[];
            }
    }
}

export interface Person {
    position: string;
    firstName: string;
    lastName: string;
    avatar: string;
    photo: string;
    bio : string[];
}
