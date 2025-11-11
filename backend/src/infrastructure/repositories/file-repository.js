import { File } from '../../domain/entities/file-entity.js';
import { IFileRepository } from '../../domain/repositories/interfaces/i-file-repository.js';

/**
 * File Repository Implementation
 * Implements the IFileRepository interface using Mongoose
 */
export class FileRepository extends IFileRepository {
  constructor(fileModel) {
    super();
    this.FileModel = fileModel;
  }

  async findById(id) {
    const fileDoc = await this.FileModel.findById(id);
    return fileDoc ? this._toEntity(fileDoc) : null;
  }

  async findByUserId(userId, options = {}) {
    const query = { uploadedBy: userId };
    const files = await this.FileModel.find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 50);
    return files.map(file => this._toEntity(file));
  }

  async findFiles(options = {}) {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = {};

    // Apply filters
    if (filters.uploadedBy) {
      query.uploadedBy = filters.uploadedBy;
    }

    // Access control filter
    if (filters.accessibleBy) {
      query.$or = [
        { isPublic: true },
        { uploadedBy: filters.accessibleBy }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [files, total] = await Promise.all([
      this.FileModel.find(query).sort(sort).skip(skip).limit(limit),
      this.FileModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      files: files.map(file => this._toEntity(file)),
      total,
      page,
      totalPages
    };
  }

  async save(fileData) {
    const fileDoc = new this.FileModel(fileData);
    const savedDoc = await fileDoc.save();
    return this._toEntity(savedDoc);
  }

  async update(id, updates) {
    const updatedDoc = await this.FileModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    return updatedDoc ? this._toEntity(updatedDoc) : null;
  }

  async delete(id) {
    const result = await this.FileModel.findByIdAndDelete(id);
    return !!result;
  }

  async fileExists(filename) {
    const count = await this.FileModel.countDocuments({ filename });
    return count > 0;
  }

  async getFileStats() {
    const [
      totalFiles,
      totalSize,
      filesByType,
      publicFiles,
      recentUploads
    ] = await Promise.all([
      this.FileModel.countDocuments(),
      this.FileModel.aggregate([{ $group: { _id: null, total: { $sum: '$size' } } }]),
      this.FileModel.aggregate([
        { $group: { _id: '$mimeType', count: { $sum: 1 } } }
      ]),
      this.FileModel.countDocuments({ isPublic: true }),
      this.FileModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    ]);

    return {
      totalFiles,
      totalSize: totalSize[0]?.total || 0,
      filesByType: filesByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      publicFiles,
      recentUploads
    };
  }

  async findFilesOlderThan(olderThan) {
    const files = await this.FileModel.find({
      createdAt: { $lt: olderThan }
    });
    return files.map(file => this._toEntity(file));
  }

  async getUserStorageUsage(userId) {
    const result = await this.FileModel.aggregate([
      { $match: { uploadedBy: userId } },
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);
    return result[0]?.total || 0;
  }

  /**
   * Convert Mongoose document to Domain Entity
   */
  _toEntity(fileDoc) {
    return new File({
      id: fileDoc._id.toString(),
      filename: fileDoc.filename,
      originalName: fileDoc.originalName,
      mimeType: fileDoc.mimeType,
      size: fileDoc.size,
      path: fileDoc.path,
      url: fileDoc.url,
      storage: fileDoc.storage,
      uploadedBy: fileDoc.uploadedBy,
      isPublic: fileDoc.isPublic,
      metadata: fileDoc.metadata,
      createdAt: fileDoc.createdAt,
      updatedAt: fileDoc.updatedAt
    });
  }
}
