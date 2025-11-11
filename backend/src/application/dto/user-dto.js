/**
 * User Data Transfer Objects
 * For transferring user data between layers
 */

export class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.isEmailVerified = user.isEmailVerified;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromEntity(user) {
    return new UserDTO(user);
  }

  static fromEntities(users) {
    return users.map(user => UserDTO.fromEntity(user));
  }
}

export class CreateUserDTO {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role || 'staff';
  }

  validate() {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Valid email is required');
    }

    if (!this.password || this.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!this.firstName || this.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }

    const validRoles = ['admin', 'manager', 'staff'];
    if (!validRoles.includes(this.role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
  }
}

export class UpdateUserDTO {
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.isActive = data.isActive;
  }

  validate() {
    if (this.firstName !== undefined && (!this.firstName || this.firstName.trim().length === 0)) {
      throw new Error('First name cannot be empty');
    }

    if (this.lastName !== undefined && (!this.lastName || this.lastName.trim().length === 0)) {
      throw new Error('Last name cannot be empty');
    }

    const validRoles = ['admin', 'manager', 'staff'];
    if (this.role !== undefined && !validRoles.includes(this.role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
  }
}

export class UserStatsDTO {
  constructor(stats) {
    this.totalUsers = stats.totalUsers || 0;
    this.activeUsers = stats.activeUsers || 0;
    this.verifiedUsers = stats.verifiedUsers || 0;
    this.usersByRole = stats.usersByRole || {};
    this.recentRegistrations = stats.recentRegistrations || 0;
  }
}
