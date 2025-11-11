/**
 * File Controller
 * Handles HTTP requests for file management
 */
export class FileController {
  constructor(
    uploadFileUseCase,
    getFilesUseCase,
    getFileUseCase,
    updateFileUseCase,
    deleteFileUseCase
  ) {
    this.uploadFileUseCase = uploadFileUseCase;
    this.getFilesUseCase = getFilesUseCase;
    this.getFileUseCase = getFileUseCase;
    this.updateFileUseCase = updateFileUseCase;
    this.deleteFileUseCase = deleteFileUseCase;
  }

  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { isPublic } = req.body;
      const uploadedBy = req.user._id.toString();

      const result = await this.uploadFileUseCase.execute({
        file: req.file.buffer || req.file,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        isPublic: isPublic === 'true'
      }, uploadedBy);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.file
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFiles(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        filters: {},
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await this.getFilesUseCase.execute(options, req.user);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFile(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const result = await this.getFileUseCase.execute(id, {
        id: currentUser._id.toString(),
        role: currentUser.role
      });

      res.json({
        success: true,
        data: result.file
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateFile(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const currentUser = req.user;

      const result = await this.updateFileUseCase.execute(id, updates, {
        id: currentUser._id.toString(),
        role: currentUser.role
      });

      res.json({
        success: true,
        message: result.message,
        data: result.file
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const result = await this.deleteFileUseCase.execute(id, {
        id: currentUser._id.toString(),
        role: currentUser.role
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async downloadFile(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const result = await this.getFileUseCase.execute(id, {
        id: currentUser._id.toString(),
        role: currentUser.role
      });

      // For now, redirect to the file URL
      // In a real implementation, you might stream the file directly
      res.redirect(result.file.url);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 :
                        error.message.includes('Access denied') ? 403 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}
