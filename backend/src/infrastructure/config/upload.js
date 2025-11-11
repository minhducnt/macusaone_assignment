import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { config } from './config.js';
import logger from './logger.js';

// Configure AWS S3 (only if available)
let s3 = null;
let multerS3 = null;

if (config.UPLOAD_STORAGE === 's3') {
  try {
    const AWS = await import('aws-sdk');
    const multerS3Module = await import('multer-s3');

    s3 = new AWS.S3({
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      region: config.AWS_REGION,
    });

    multerS3 = multerS3Module.default;
    logger.info('AWS S3 configured for file uploads');
  } catch (error) {
    logger.error('AWS SDK not available. Install aws-sdk and multer-s3 for S3 support:', error.message);
    logger.info('Falling back to local storage');
  }
}

// Ensure upload directory exists for local storage
const ensureUploadDir = () => {
  if (config.UPLOAD_STORAGE === 'local' && !fs.existsSync(config.UPLOAD_DEST)) {
    fs.mkdirSync(config.UPLOAD_DEST, { recursive: true });
    logger.info(`Created upload directory: ${config.UPLOAD_DEST}`);
  }
};

// Generate unique filename
const generateFilename = (originalname) => {
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext);
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${name}-${timestamp}-${random}${ext}`;
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${config.ALLOWED_FILE_TYPES.join(', ')}`), false);
  }
};

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir();
    cb(null, config.UPLOAD_DEST);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateFilename(file.originalname);
    cb(null, uniqueFilename);
  }
});

// S3 storage configuration
let s3Storage = null;
if (s3 && multerS3) {
  s3Storage = multerS3({
    s3: s3,
    bucket: config.AWS_S3_BUCKET,
    acl: 'private',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueFilename = `uploads/${generateFilename(file.originalname)}`;
      cb(null, uniqueFilename);
    }
  });
}

// Choose storage based on configuration and availability
let storage;
if (config.UPLOAD_STORAGE === 's3' && s3Storage) {
  storage = s3Storage;
  logger.info('Using S3 storage for file uploads');
} else {
  storage = localStorage;
  if (config.UPLOAD_STORAGE === 's3') {
    logger.warn('S3 configured but dependencies not available. Using local storage.');
  }
}

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Upload functions
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);

// File URL generation
export const getFileUrl = (filename) => {
  if (config.UPLOAD_STORAGE === 's3') {
    return `${config.AWS_S3_URL}/${filename}`;
  } else {
    return `/uploads/${filename}`;
  }
};

// File deletion
export const deleteFile = async (filename) => {
  try {
    if (config.UPLOAD_STORAGE === 's3' && s3) {
      await s3.deleteObject({
        Bucket: config.AWS_S3_BUCKET,
        Key: `uploads/${filename}`,
      }).promise();
      logger.info(`File deleted from S3: ${filename}`);
    } else {
      const filePath = path.join(config.UPLOAD_DEST, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`File deleted from local storage: ${filename}`);
      }
    }
    return true;
  } catch (error) {
    logger.error(`Failed to delete file ${filename}:`, error);
    return false;
  }
};

// Get file information
export const getFileInfo = (filename) => {
  if (config.UPLOAD_STORAGE === 's3') {
    return {
      url: getFileUrl(`uploads/${filename}`),
      storage: 's3',
      bucket: config.AWS_S3_BUCKET,
      key: `uploads/${filename}`
    };
  } else {
    const filePath = path.join(config.UPLOAD_DEST, filename);
    let stats = null;
    try {
      stats = fs.statSync(filePath);
    } catch (error) {
      logger.error(`Failed to get file stats for ${filename}:`, error);
    }

    return {
      url: getFileUrl(filename),
      storage: 'local',
      path: filePath,
      size: stats ? stats.size : null,
      modified: stats ? stats.mtime : null,
      exists: !!stats
    };
  }
};

// Get file stats
export const getFileStats = (filename) => {
  if (config.UPLOAD_STORAGE === 's3') {
    // S3 stats would require additional API calls
    return {
      url: getFileUrl(`uploads/${filename}`),
      storage: 's3',
      bucket: config.AWS_S3_BUCKET
    };
  } else {
    const filePath = path.join(config.UPLOAD_DEST, filename);
    let stats = null;
    try {
      stats = fs.statSync(filePath);
    } catch (error) {
      logger.error(`Failed to get file stats for ${filename}:`, error);
    }

    return {
      url: getFileUrl(filename),
      storage: 'local',
      path: filePath,
      size: stats ? stats.size : null,
      modified: stats ? stats.mtime : null,
      created: stats ? stats.birthtime : null,
      exists: !!stats
    };
  }
};

// Cleanup old files (local storage only)
export const cleanupOldFiles = (maxAge = 30 * 24 * 60 * 60 * 1000) => { // 30 days default
  if (config.UPLOAD_STORAGE !== 'local') {
    return;
  }

  try {
    const files = fs.readdirSync(config.UPLOAD_DEST);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(config.UPLOAD_DEST, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        logger.info(`Cleaned up old file: ${file}`);
      }
    }
  } catch (error) {
    logger.error('Failed to cleanup old files:', error);
  }
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  getFileUrl,
  deleteFile,
  getFileInfo,
  getFileStats,
  cleanupOldFiles
};
