from decouple import config


class Config:
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevConfig(Config):
    JWT_SECRET_KEY = config('JWT_SECRET_KEY')  # New JWT Secret Key
    JWT_ALGORITHM = config('JWT_ALGORITHM', default='HS256')  # Default algorithm
    JWT_ACCESS_TOKEN_EXPIRES = config('JWT_ACCESS_TOKEN_EXPIRES', default=604800)  # Default access token lifetime in seconds 1 HOUR 3600
    JWT_REFRESH_TOKEN_EXPIRES = config('JWT_REFRESH_TOKEN_EXPIRES', default=604800)  # Default refresh token lifetime in seconds 7 DAYS
    DB_USERNAME = config('DB_USERNAME')
    DB_PASSWORD = config('DB_PASSWORD')
    DB_HOST = config('DB_HOST')
    DB_PORT = config('DB_PORT')
    DB_NAME = config('DB_NAME')
    SQLALCHEMY_DATABASE_URI = config('SQLALCHEMY_DATABASE_URI')
    DEBUG = True
    SQLALCHEMY_ECHO = True
class PostConfig(Config):
    pass

class TestConfig(Config):
    pass
