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
    server_url: 'http://localhost:3000',
    default_users: './default-users.json',
    min_field_length: 5,
    max_field_length: 30,
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

// config for photo-service
cfg.photoService = {

}

// config for video-service
cfg.videoService = {

}

//config for download-service
cfg.downloadService = {

}

module.exports = cfg;