/**
 * User Domain Entity
 * Represents the core business concept of a User
 */
export class User {
  constructor({
    id,
    email,
    password,
    firstName,
    lastName,
    role = 'staff',
    isEmailVerified = false,
    emailVerificationToken,
    emailVerificationExpires,
    passwordResetToken,
    passwordResetExpires,
    isActive = true,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.isEmailVerified = isEmailVerified;
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationExpires = emailVerificationExpires;
    this.passwordResetToken = passwordResetToken;
    this.passwordResetExpires = passwordResetExpires;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  /**
   * Business rules validation
   */
  validate() {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    // During migration, allow empty firstName/lastName (will be handled by repository)
    if (this.firstName !== undefined && this.firstName !== null &&
        (!this.firstName || this.firstName.trim().length === 0)) {
      throw new Error('First name is required');
    }

    if (this.lastName !== undefined && this.lastName !== null &&
        (!this.lastName || this.lastName.trim().length === 0)) {
      throw new Error('Last name is required');
    }

    const validRoles = ['admin', 'manager', 'staff'];
    if (this.role && !validRoles.includes(this.role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
  }

  /**
   * Business methods
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isManager() {
    return this.role === 'manager' || this.role === 'admin';
  }

  canManageUsers() {
    return this.isManager();
  }

  canAccessAdminFeatures() {
    return this.isAdmin();
  }

  /**
   * Domain events (for future CQRS implementation)
   */
  markAsEmailVerified() {
    if (this.isEmailVerified) {
      throw new Error('User email is already verified');
    }
    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    this.emailVerificationExpires = null;

    // Return domain event for potential event sourcing
    return {
      type: 'UserEmailVerified',
      userId: this.id,
      occurredAt: new Date()
    };
  }

  changePassword(newPassword) {
    this.password = newPassword;
    this.passwordResetToken = null;
    this.passwordResetExpires = null;

    return {
      type: 'UserPasswordChanged',
      userId: this.id,
      occurredAt: new Date()
    };
  }

  updateProfile(updates) {
    const allowedFields = ['firstName', 'lastName'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        this[field] = updates[field];
      }
    });

    this.validate();

    return {
      type: 'UserProfileUpdated',
      userId: this.id,
      updates: allowedFields.reduce((acc, field) => {
        if (updates[field] !== undefined) {
          acc[field] = updates[field];
        }
        return acc;
      }, {}),
      occurredAt: new Date()
    };
  }

  deactivate() {
    this.isActive = false;
    return {
      type: 'UserDeactivated',
      userId: this.id,
      occurredAt: new Date()
    };
  }

  activate() {
    this.isActive = true;
    return {
      type: 'UserActivated',
      userId: this.id,
      occurredAt: new Date()
    };
  }
}
