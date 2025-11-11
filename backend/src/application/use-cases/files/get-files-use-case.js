/**
 * Get Files Use Case
 * Handles retrieving files with pagination and filtering
 */
export class GetFilesUseCase {
  constructor(fileRepository) {
    this.fileRepository = fileRepository;
  }

  async execute(options = {}, currentUser) {
    try {
      const filters = { ...options.filters };

      // Apply access control
      if (currentUser.role !== 'admin') {
        // Non-admin users can only see their own files or public files
        filters.accessibleBy = currentUser.id;
      }

      const result = await this.fileRepository.findFiles({
        ...options,
        filters
      });

      return {
        files: result.files.map(file => ({
          id: file.id,
          filename: file.filename,
          originalName: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          url: file.url,
          isPublic: file.isPublic,
          uploadedBy: file.uploadedBy,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt
        })),
        pagination: {
          page: result.page,
          limit: result.limit || options.limit || 10,
          total: result.total,
          totalPages: result.totalPages
        }
      };
    } catch (error) {
      throw new Error(`Failed to get files: ${error.message}`);
    }
  }
}
