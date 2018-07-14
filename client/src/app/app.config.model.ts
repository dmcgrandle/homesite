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
    }
}