/**
 * Upload File Use Case
 * Handles file upload logic
 */
export class UploadFileUseCase {
  constructor(fileRepository, fileStorageService) {
    this.fileRepository = fileRepository;
    this.fileStorageService = fileStorageService;
  }

  async execute({ file, filename, originalName, mimeType, size, isPublic = false }, uploadedBy) {
    try {
      // Validate input
      if (!file || !filename || !originalName || !mimeType || !size) {
        throw new Error('File data is incomplete');
      }

      if (!uploadedBy) {
        throw new Error('User ID is required');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (size > maxSize) {
        throw new Error('File size exceeds maximum limit of 5MB');
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain'
      ];

      if (!allowedTypes.includes(mimeType)) {
        throw new Error(`File type ${mimeType} is not allowed`);
      }

      // Generate unique filename if not provided
      const uniqueFilename = filename || `${Date.now()}-${Math.random().toString(36).substring(2)}.${originalName.split('.').pop()}`;

      // Upload file to storage
      const uploadResult = await this.fileStorageService.uploadFile(file, uniqueFilename);

      // Create file entity
      const fileEntity = await this.fileRepository.save({
        filename: uniqueFilename,
        originalName,
        mimeType,
        size,
        path: uploadResult.path,
        url: uploadResult.url,
        storage: uploadResult.storage,
        uploadedBy,
        isPublic,
        metadata: {
          uploadDate: new Date(),
          originalName
        }
      });

      // Log the upload
      console.log(`File uploaded by ${uploadedBy}: ${fileEntity.id} (${uniqueFilename})`);

      return {
        file: {
          id: fileEntity.id,
          filename: fileEntity.filename,
          originalName: fileEntity.originalName,
          mimeType: fileEntity.mimeType,
          size: fileEntity.size,
          url: fileEntity.url,
          isPublic: fileEntity.isPublic,
          uploadedBy: fileEntity.uploadedBy,
          createdAt: fileEntity.createdAt
        },
        message: 'File uploaded successfully'
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}
