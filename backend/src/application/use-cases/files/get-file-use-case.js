/**
 * Get File Use Case
 * Handles retrieving a single file
 */
export class GetFileUseCase {
  constructor(fileRepository) {
    this.fileRepository = fileRepository;
  }

  async execute(fileId, currentUser) {
    try {
      // Validate input
      if (!fileId) {
        throw new Error('File ID is required');
      }

      // Find the file
      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Check access permissions
      const canAccess = file.isPublic ||
                       file.uploadedBy === currentUser.id ||
                       currentUser.role === 'admin' ||
                       currentUser.role === 'manager';

      if (!canAccess) {
        throw new Error('Access denied to this file');
      }

      return {
        file: {
          id: file.id,
          filename: file.filename,
          originalName: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          url: file.url,
          isPublic: file.isPublic,
          uploadedBy: file.uploadedBy,
          metadata: file.metadata,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt
        }
      };
    } catch (error) {
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }
}
