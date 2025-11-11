import { User } from '../../domain/entities/user-entity.js';
import { IUserRepository } from '../../domain/repositories/interfaces/i-user-repository.js';

/**
 * User Repository Implementation
 * Implements the IUserRepository interface using Mongoose
 */
export class UserRepository extends IUserRepository {
  constructor(userModel) {
    super();
    this.UserModel = userModel;
  }

  async findById(id) {
    const userDoc = await this.UserModel.findById(id);
    return userDoc ? this._toEntity(userDoc) : null;
  }

  async findByEmail(email) {
    const userDoc = await this.UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    return userDoc ? this._toEntity(userDoc) : null;
  }

  async findByEmailVerificationToken(token) {
    const userDoc = await this.UserModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });
    return userDoc ? this._toEntity(userDoc) : null;
  }

  async findByPasswordResetToken(token) {
    const userDoc = await this.UserModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });
    return userDoc ? this._toEntity(userDoc) : null;
  }

  async findUsers(options = {}) {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const query = {};

    // Apply filters
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.isEmailVerified !== undefined) {
      query.isEmailVerified = filters.isEmailVerified;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [users, total] = await Promise.all([
      this.UserModel.find(query).sort(sort).skip(skip).limit(limit),
      this.UserModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => this._toEntity(user)),
      total,
      page,
      totalPages
    };
  }

  async save(userData) {
    const userDoc = new this.UserModel(userData);
    const savedDoc = await userDoc.save();
    return this._toEntity(savedDoc);
  }

  async update(id, updates) {
    const updatedDoc = await this.UserModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    return updatedDoc ? this._toEntity(updatedDoc) : null;
  }

  async delete(id) {
    const result = await this.UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async emailExists(email, excludeId = null) {
    const query = { email: email.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const count = await this.UserModel.countDocuments(query);
    return count > 0;
  }

  async getUserStats() {
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      usersByRole,
      recentRegistrations
    ] = await Promise.all([
      this.UserModel.countDocuments(),
      this.UserModel.countDocuments({ isActive: true }),
      this.UserModel.countDocuments({ isEmailVerified: true }),
      this.UserModel.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      this.UserModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentRegistrations
    };
  }

  /**
   * Convert Mongoose document to Domain Entity
   */
  _toEntity(userDoc) {
    // Handle migration from old 'name' field to 'firstName'/'lastName' fields
    let firstName = userDoc.firstName;
    let lastName = userDoc.lastName;

    // If we have the old 'name' field but no firstName/lastName, split it
    if (userDoc.name && (!firstName || !lastName)) {
      const nameParts = userDoc.name.trim().split(' ');
      firstName = firstName || nameParts[0] || 'Unknown';
      lastName = lastName || nameParts.slice(1).join(' ') || 'User';
    }

    // Provide defaults for missing fields during migration
    firstName = firstName || 'Unknown';
    lastName = lastName || 'User';

    return new User({
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      firstName,
      lastName,
      role: userDoc.role || 'staff',
      isEmailVerified: userDoc.emailVerified || false,
      emailVerificationToken: userDoc.emailVerificationToken,
      emailVerificationExpires: userDoc.emailVerificationExpires,
      passwordResetToken: userDoc.passwordResetToken,
      passwordResetExpires: userDoc.passwordResetExpires,
      isActive: userDoc.isActive !== false, // Default to true
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    });
  }
}
