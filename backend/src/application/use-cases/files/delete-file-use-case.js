/**
 * Delete File Use Case
 * Handles file deletion
 */
export class DeleteFileUseCase {
  constructor(fileRepository, fileStorageService) {
    this.fileRepository = fileRepository;
    this.fileStorageService = fileStorageService;
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

      // Check permissions
      const canDelete = file.uploadedBy === currentUser.id ||
                       currentUser.role === 'admin' ||
                       currentUser.role === 'manager';

      if (!canDelete) {
        throw new Error('Insufficient permissions to delete this file');
      }

      // Delete from storage
      const storageDeleted = await this.fileStorageService.deleteFile(file.filename);
      if (!storageDeleted) {
        console.warn(`Failed to delete file ${file.filename} from storage, but proceeding with database deletion`);
      }

      // Delete from database
      const deleted = await this.fileRepository.delete(fileId);
      if (!deleted) {
        throw new Error('Failed to delete file from database');
      }

      // Log the deletion
      console.log(`File ${fileId} (${file.filename}) deleted by ${currentUser.id}`);

      return {
        message: 'File deleted successfully',
        fileId: fileId
      };
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }
}
