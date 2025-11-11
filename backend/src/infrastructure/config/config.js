// Environment configuration
export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_auth',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,

  // Email configuration
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@yourapp.com',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Your App',
  EMAIL_HOST: process.env.EMAIL_HOST || (process.env.NODE_ENV === 'development' ? 'localhost' : 'smtp.gmail.com'),
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || (process.env.NODE_ENV === 'development' ? 1025 : 587),
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true' || false,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || (process.env.NODE_ENV === 'development' ? 'mailhog' : 'gmail'),

  // Token expiration times
  EMAIL_VERIFICATION_EXPIRES: process.env.EMAIL_VERIFICATION_EXPIRES || '24h', // 24 hours
  PASSWORD_RESET_EXPIRES: process.env.PASSWORD_RESET_EXPIRES || '1h', // 1 hour

  // File upload configuration
  UPLOAD_STORAGE: process.env.UPLOAD_STORAGE || 'local', // 'local' or 's3'
  UPLOAD_DEST: process.env.UPLOAD_DEST || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES ?
    process.env.ALLOWED_FILE_TYPES.split(',') :
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],

  // AWS S3 configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_S3_URL: process.env.AWS_S3_URL || `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,

  // Redis configuration
  REDIS_ENABLED: process.env.REDIS_ENABLED === 'true' || false,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: parseInt(process.env.REDIS_DB) || 0,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_CACHE_TTL: parseInt(process.env.REDIS_CACHE_TTL) || 3600, // 1 hour default

  // Cache configuration
  CACHE_USER_DATA_TTL: parseInt(process.env.CACHE_USER_DATA_TTL) || 1800, // 30 minutes
  CACHE_FILE_DATA_TTL: parseInt(process.env.CACHE_FILE_DATA_TTL) || 3600, // 1 hour
  CACHE_API_RESPONSE_TTL: parseInt(process.env.CACHE_API_RESPONSE_TTL) || 300 // 5 minutes
};

export default config;
