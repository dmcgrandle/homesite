/* config.js - main config for server in homesite */
let cfg = {};

// config for db-service
cfg.dbService = {
    db_url: 'mongodb://localhost:27017',
    db_name: 'homesite'
};

// config for token-service
cfg.tokenService = {
    private_key: require('./keys/jwtRS256.key'), 
    public_key: require('./keys/jwtRS256.key.pub'),
    email_secret: require('./keys/email-secret.key')
}

// config for user-service
cfg.userService = {
    PW_SECRET: 'SuperSecret', // must match client/src/assets/config/config.prod.json -> login.password_secret
    SALT_ROUNDS: 8, // see "A Note on Rounds" here: https://www.npmjs.com/package/bcrypt before changing
    server_url: 'http://localhost:3000',
    default_users: './default-users.json',
    min_field_length: 5,
    max_field_length: 60,
    mail: {
        smtp_config: {
            host: 'mail.mcgrandle.com',
            port: 587,
            secure: false,
            auth: require('./keys/smtp-auth.user')
        }
    }
}

// config for file-service
cfg.fileService = {

}

// config for media-service
cfg.mediaService = {
    PHOTO_DIR : {
        PATH: '/protected/images/', // Note: the trailing slash is important ...
        CACHE_DIR: '.cache'
    },
    VIDEO_DIR: {
        PATH: '/protected/videos/',
        CACHE_DIR: '.cache'
    },
    THUMBS: {
        // Note: currently homesite displays thumbs only (no large image)
        // to users with screen resolution < 600px (mobile devices), so 
        // setting WIDTH: 600 would give them full res images, however it
        // would also dramatically increase the size of the thumbnails ...
        WIDTH: 300, // height will depend on aspect ratio
        FORMAT: 'jpeg',
        PREFIX: 'thumb', // prefix for each file, eg: thumb-f5f15876.jpg
        SUFFIX: '.jpg',  // suffix - change to match FORMAT above
        MAX_CREATE_AT_ONCE: 50 // limit for constrained env, eg: Raspberry Pi
    },
    POSTERS: { // poster image to display for video file
        WIDTH: 600,
        FORMAT: 'jpeg',
        PREFIX: 'poster',
        SUFFIX: '.jpg',
        MAX_CREATE_AT_ONCE: 20
    }
}

//config for download-service
cfg.downloadService = {
    DOWNLOAD_DIR : {
        PATH: '/protected/downloads/',
        CACHE_DIR: '.cache'
    },
    TYPE_DESCRIPTION_DB : './file-type-description.txt',
    USE_SI_SIZE: true  // http://www.kossboss.com/?p=2234
}

module.exports = cfg;