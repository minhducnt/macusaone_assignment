import fs from 'fs';
import path from 'path';
import { config } from '../../infrastructure/config/config.js';

/**
 * File Storage Service
 * Handles file storage operations (local and cloud)
 */
export class FileStorageService {
  constructor() {
    this.storageType = config.UPLOAD_STORAGE || 'local';
    this.uploadDest = config.UPLOAD_DEST || './uploads';
  }

  /**
   * Upload file to storage
   * @param {Buffer|Object} file - File buffer or file object
   * @param {string} filename - Unique filename
   * @returns {Promise<Object>} Upload result with path and URL
   */
  async uploadFile(file, filename) {
    if (this.storageType === 's3') {
      return this._uploadToS3(file, filename);
    } else {
      return this._uploadToLocal(file, filename);
    }
  }

  /**
   * Delete file from storage
   * @param {string} filename - Filename to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(filename) {
    if (this.storageType === 's3') {
      return this._deleteFromS3(filename);
    } else {
      return this._deleteFromLocal(filename);
    }
  }

  /**
   * Upload file to local storage
   */
  async _uploadToLocal(file, filename) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDest)) {
      fs.mkdirSync(this.uploadDest, { recursive: true });
    }

    const filePath = path.join(this.uploadDest, filename);

    // Write file to disk
    if (file.buffer) {
      // Multer memory storage
      fs.writeFileSync(filePath, file.buffer);
    } else {
      // File stream or other format
      fs.writeFileSync(filePath, file);
    }

    return {
      path: filePath,
      url: `/uploads/${filename}`,
      storage: 'local'
    };
  }

  /**
   * Delete file from local storage
   */
  async _deleteFromLocal(filename) {
    try {
      const filePath = path.join(this.uploadDest, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting local file:', error);
      return false;
    }
  }

  /**
   * Upload file to S3 (placeholder - would need AWS SDK)
   */
  async _uploadToS3(file, filename) {
    // This would require aws-sdk and multer-s3
    // For now, fall back to local storage
    console.warn('S3 storage not implemented, falling back to local storage');
    return this._uploadToLocal(file, filename);
  }

  /**
   * Delete file from S3 (placeholder - would need AWS SDK)
   */
  async _deleteFromS3(filename) {
    // This would require aws-sdk
    // For now, return false
    console.warn('S3 deletion not implemented');
    return false;
  }

  /**
   * Get file URL
   * @param {string} filename - Filename
   * @returns {string} File URL
   */
  getFileUrl(filename) {
    if (this.storageType === 's3') {
      return `${config.AWS_S3_URL}/${filename}`;
    } else {
      return `/uploads/${filename}`;
    }
  }

  /**
   * Check if file exists
   * @param {string} filename - Filename
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filename) {
    if (this.storageType === 's3') {
      // Would need to check S3
      return false;
    } else {
      const filePath = path.join(this.uploadDest, filename);
      return fs.existsSync(filePath);
    }
  }
}
