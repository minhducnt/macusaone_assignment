/**
 * File Domain Entity
 * Represents the core business concept of a File
 */
export class File {
  constructor({
    id,
    filename,
    originalName,
    mimeType,
    size,
    path,
    url,
    storage = 'local',
    uploadedBy,
    isPublic = false,
    metadata = {},
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.filename = filename;
    this.originalName = originalName;
    this.mimeType = mimeType;
    this.size = size;
    this.path = path;
    this.url = url;
    this.storage = storage;
    this.uploadedBy = uploadedBy;
    this.isPublic = isPublic;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  /**
   * Business rules validation
   */
  validate() {
    if (!this.filename || this.filename.trim().length === 0) {
      throw new Error('Filename is required');
    }

    if (!this.originalName || this.originalName.trim().length === 0) {
      throw new Error('Original name is required');
    }

    if (!this.mimeType || this.mimeType.trim().length === 0) {
      throw new Error('MIME type is required');
    }

    if (this.size <= 0) {
      throw new Error('File size must be greater than 0');
    }

    const validStorages = ['local', 's3'];
    if (!validStorages.includes(this.storage)) {
      throw new Error(`Invalid storage type. Must be one of: ${validStorages.join(', ')}`);
    }

    if (!this.uploadedBy) {
      throw new Error('Uploaded by user is required');
    }
  }

  /**
   * Business methods
   */
  getFileExtension() {
    return this.originalName.split('.').pop().toLowerCase();
  }

  isImage() {
    return this.mimeType.startsWith('image/');
  }

  isDocument() {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return documentTypes.includes(this.mimeType);
  }

  getSizeInMB() {
    return (this.size / (1024 * 1024)).toFixed(2);
  }

  canBeAccessedBy(userId) {
    return this.isPublic || this.uploadedBy === userId;
  }

  /**
   * Domain events
   */
  markAsPublic() {
    if (this.isPublic) {
      throw new Error('File is already public');
    }
    this.isPublic = true;
    return {
      type: 'FileMadePublic',
      fileId: this.id,
      occurredAt: new Date()
    };
  }

  markAsPrivate() {
    if (!this.isPublic) {
      throw new Error('File is already private');
    }
    this.isPublic = false;
    return {
      type: 'FileMadePrivate',
      fileId: this.id,
      occurredAt: new Date()
    };
  }

  updateMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
    return {
      type: 'FileMetadataUpdated',
      fileId: this.id,
      metadata: this.metadata,
      occurredAt: new Date()
    };
  }
}
