/**
 * Update File Use Case
 * Handles file metadata updates
 */
export class UpdateFileUseCase {
  constructor(fileRepository) {
    this.fileRepository = fileRepository;
  }

  async execute(fileId, updates, currentUser) {
    try {
      // Validate input
      if (!fileId) {
        throw new Error('File ID is required');
      }

      if (!updates || Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }

      // Find the file
      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Check permissions
      const canUpdate = file.uploadedBy === currentUser.id ||
                       currentUser.role === 'admin' ||
                       currentUser.role === 'manager';

      if (!canUpdate) {
        throw new Error('Insufficient permissions to update this file');
      }

      // Validate updates
      const allowedFields = ['filename', 'isPublic'];
      const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields for update: ${invalidFields.join(', ')}`);
      }

      // Validate filename if provided
      if (updates.filename) {
        const trimmedFilename = updates.filename.trim();
        if (trimmedFilename.length === 0) {
          throw new Error('Filename cannot be empty');
        }
        updates.filename = trimmedFilename;
      }

      // Update the file
      const updatedFile = await this.fileRepository.update(fileId, updates);

      if (!updatedFile) {
        throw new Error('Failed to update file');
      }

      // Log the update
      console.log(`File ${fileId} updated by ${currentUser.id}: ${Object.keys(updates).join(', ')}`);

      return {
        file: {
          id: updatedFile.id,
          filename: updatedFile.filename,
          originalName: updatedFile.originalName,
          mimeType: updatedFile.mimeType,
          size: updatedFile.size,
          url: updatedFile.url,
          isPublic: updatedFile.isPublic,
          uploadedBy: updatedFile.uploadedBy,
          updatedAt: updatedFile.updatedAt
        },
        message: 'File updated successfully'
      };
    } catch (error) {
      throw new Error(`File update failed: ${error.message}`);
    }
  }
}
