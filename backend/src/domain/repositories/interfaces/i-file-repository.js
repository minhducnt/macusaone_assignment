/**
 * File Repository Interface
 * Defines the contract for file data operations
 */
export class IFileRepository {
  /**
   * Find file by ID
   * @param {string} id - File ID
   * @returns {Promise<File|null>} File entity or null
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Find files by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<File[]>} Array of file entities
   */
  async findByUserId(userId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Find files with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Items per page
   * @param {Object} options.filters - Filter criteria
   * @param {string} options.sortBy - Sort field
   * @param {string} options.sortOrder - Sort order ('asc'|'desc')
   * @returns {Promise<{files: File[], total: number, page: number, totalPages: number}>}
   */
  async findFiles(options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Save file
   * @param {File} file - File entity
   * @returns {Promise<File>} Saved file entity
   */
  async save(file) {
    throw new Error('Method not implemented');
  }

  /**
   * Update file
   * @param {string} id - File ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<File>} Updated file entity
   */
  async update(id, updates) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete file
   * @param {string} id - File ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Check if file exists
   * @param {string} filename - Filename to check
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filename) {
    throw new Error('Method not implemented');
  }

  /**
   * Get file statistics
   * @returns {Promise<Object>} File statistics
   */
  async getFileStats() {
    throw new Error('Method not implemented');
  }

  /**
   * Find files older than specified date
   * @param {Date} olderThan - Date threshold
   * @returns {Promise<File[]>} Array of old file entities
   */
  async findFilesOlderThan(olderThan) {
    throw new Error('Method not implemented');
  }

  /**
   * Get total storage used by user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total storage in bytes
   */
  async getUserStorageUsage(userId) {
    throw new Error('Method not implemented');
  }
}
