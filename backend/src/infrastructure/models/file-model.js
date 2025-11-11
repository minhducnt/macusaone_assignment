import mongoose from 'mongoose';
import { config } from '../config/config.js';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true,
  },
  originalname: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true,
  },
  mimetype: {
    type: String,
    required: [true, 'Mimetype is required'],
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size cannot be negative'],
  },
  url: {
    type: String,
    required: [true, 'File URL is required'],
  },
  storage: {
    type: String,
    enum: ['local', 's3'],
    default: config.UPLOAD_STORAGE,
  },
  path: {
    type: String,
    // Path is required for local storage
    required: function() {
      return this.storage === 'local';
    },
  },
  bucket: {
    type: String,
    // Bucket is required for S3 storage
    required: function() {
      return this.storage === 's3';
    },
  },
  key: {
    type: String,
    // Key is required for S3 storage
    required: function() {
      return this.storage === 's3';
    },
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploaded by user is required'],
  },
  category: {
    type: String,
    enum: ['profile', 'document', 'avatar', 'general'],
    default: 'general',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  metadata: {
    width: Number, // For images
    height: Number, // For images
    duration: Number, // For videos/audio (future use)
    encoding: String,
    alt: String, // Alternative text for images
  },
}, {
  timestamps: true,
});

// Index for efficient queries
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ category: 1, createdAt: -1 });
fileSchema.index({ filename: 1 });

// Virtual for file extension
fileSchema.virtual('extension').get(function() {
  return this.originalname.split('.').pop();
});

// Method to get file info
fileSchema.methods.getInfo = function() {
  return {
    id: this._id,
    filename: this.filename,
    originalname: this.originalname,
    mimetype: this.mimetype,
    size: this.size,
    url: this.url,
    storage: this.storage,
    category: this.category,
    isPublic: this.isPublic,
    extension: this.extension,
    uploadedBy: this.uploadedBy,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    metadata: this.metadata,
  };
};

// Static method to find files by user
fileSchema.statics.findByUser = function(userId, options = {}) {
  const query = { uploadedBy: userId };

  if (options.category) {
    query.category = options.category;
  }

  if (options.isPublic !== undefined) {
    query.isPublic = options.isPublic;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Pre-remove middleware to delete file from storage
fileSchema.pre('remove', async function(next) {
  try {
    const uploadService = await import('../config/upload.js');

    if (this.storage === 's3' && this.key) {
      await uploadService.deleteFile(this.filename);
    } else if (this.storage === 'local' && this.path) {
      const fs = await import('fs');
      const path = await import('path');

      const fullPath = this.path;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('File', fileSchema);
