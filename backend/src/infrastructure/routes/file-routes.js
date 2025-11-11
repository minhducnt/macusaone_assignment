import express from 'express';
import multer from 'multer';
import { FileController } from '../controllers/file-controller.js';
import { validateRequest, validateQuery } from '../middleware/validation-middleware.js';
import { fileSchemas } from '../middleware/validation-schemas.js';
import { authenticate } from '../middleware/auth-middleware.js';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

/**
 * File Routes
 * Defines routes for file management operations
 */
export function createFileRoutes(fileController) {
  const router = express.Router();

  // All routes require authentication
  router.use(authenticate);

  /**
   * @swagger
   * /files:
   *   get:
   *     summary: Get files with pagination and filtering
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50
   *           default: 10
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, filename, size]
   *           default: createdAt
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: Files retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  router.get('/',
    validateQuery(fileSchemas.getFiles),
    fileController.getFiles.bind(fileController)
  );

  /**
   * @swagger
   * /files:
   *   post:
   *     summary: Upload a file
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: File to upload
   *               isPublic:
   *                 type: boolean
   *                 description: Whether the file should be publicly accessible
   *                 default: false
   *     responses:
   *       201:
   *         description: File uploaded successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  router.post('/',
    upload.single('file'),
    validateRequest(fileSchemas.uploadFile),
    fileController.uploadFile.bind(fileController)
  );

  /**
   * @swagger
   * /files/{id}:
   *   get:
   *     summary: Get file by ID
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: File retrieved successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: File not found
   */
  router.get('/:id',
    fileController.getFile.bind(fileController)
  );

  /**
   * @swagger
   * /files/{id}/download:
   *   get:
   *     summary: Download file by ID
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: File download initiated
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: File not found
   */
  router.get('/:id/download',
    fileController.downloadFile.bind(fileController)
  );

  /**
   * @swagger
   * /files/{id}:
   *   put:
   *     summary: Update file metadata by ID
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filename:
   *                 type: string
   *               isPublic:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: File updated successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: File not found
   */
  router.put('/:id',
    validateRequest(fileSchemas.updateFile),
    fileController.updateFile.bind(fileController)
  );

  /**
   * @swagger
   * /files/{id}:
   *   delete:
   *     summary: Delete file by ID
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: File deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: File not found
   */
  router.delete('/:id',
    fileController.deleteFile.bind(fileController)
  );

  return router;
}
