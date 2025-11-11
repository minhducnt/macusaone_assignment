/**
 * User Controller
 * Handles HTTP requests for user management
 */
export class UserController {
  constructor(
    getUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserStatsUseCase
  ) {
    this.getUsersUseCase = getUsersUseCase;
    this.createUserUseCase = createUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
    this.getUserStatsUseCase = getUserStatsUseCase;
  }

  async getUsers(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        filters: {
          email: req.query.email,
          role: req.query.role,
          isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
          isEmailVerified: req.query.isEmailVerified ? req.query.isEmailVerified === 'true' : undefined
        },
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await this.getUsersUseCase.execute(options);

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

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      // Check if user can access this profile
      const canAccess = currentUser.role === 'admin' ||
                       currentUser.role === 'manager' ||
                       currentUser._id.toString() === id;

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // For now, reuse getUsers logic but filter for single user
      const options = {
        page: 1,
        limit: 1,
        filters: { id }
      };

      const result = await this.getUsersUseCase.execute(options);

      if (result.users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user: result.users[0] }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createUser(req, res) {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      const createdBy = req.user._id.toString();

      const result = await this.createUserUseCase.execute({
        email,
        password,
        firstName,
        lastName,
        role
      }, createdBy);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const currentUser = req.user;

      const result = await this.updateUserUseCase.execute(id, updates, {
        id: currentUser._id.toString(),
        role: currentUser.role
      });

      res.json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const result = await this.deleteUserUseCase.execute(id, {
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

  async getUserStats(req, res) {
    try {
      const result = await this.getUserStatsUseCase.execute();

      res.json({
        success: true,
        data: result.stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
