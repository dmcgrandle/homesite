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
    gallery: {
        featuredPhoto: {
            filename: string;
        },
        featuredVideo: {
            filename: string;
        }
    };
    login: {
        title: string;
    };
    auth: {
        password_secret: string;
    }

}