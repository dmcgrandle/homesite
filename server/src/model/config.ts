import { SMTPAuth } from './user';

export interface Config {
  dbService: {
    db_url: string;
    db_name: string;
  };
  tokenService: {
    private_key: string;
    public_key: string;
    email_secret: string;
  };
  userService: {
    DB_COLLECTION_NAME: string;
    PW_SECRET: string;
    SALT_ROUNDS: number;
    server_url: string;
    default_users: string;
    min_field_length: number;
    max_field_length: number;
    mail: {
      smtp_config: {
        host: string;
        port: number;
        secure: boolean;
        auth: SMTPAuth;
      },
    },
  };
  fileService: {};
  mediaService: {
    PHOTO_DIR: {
      PATH: string;
      CACHE_DIR: string;
    },
    VIDEO_DIR: {
      PATH: string;
      CACHE_DIR: string;
    },
    THUMBS: {
      WIDTH: number;
      FORMAT: string;
      PREFIX: string;
      SUFFIX: string;
      MAX_CREATE_AT_ONCE: number;
    },
    POSTERS: { 
      WIDTH: number;
      FORMAT: string;
      PREFIX: string;
      SUFFIX: string;
      MAX_CREATE_AT_ONCE: number;
    },
  };
  downloadService: {
    DB_COLLECTION_NAME: string;
    DOWNLOAD_DIR: {
      PATH: string;
      CACHE_DIR: string;
    },
    TYPE_DESCRIPTION_DB: string;
    USE_SI_SIZE: boolean;
  };
}
