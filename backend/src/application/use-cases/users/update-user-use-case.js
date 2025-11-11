/**
 * Update User Use Case
 * Handles user profile updates
 */
export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, updates, currentUser) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!updates || Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }

      // Find the user to update
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check permissions
      const canUpdate = currentUser.role === 'admin' ||
                        currentUser.role === 'manager' ||
                        currentUser.id === userId;

      if (!canUpdate) {
        throw new Error('Insufficient permissions to update this user');
      }

      // Additional checks for role updates
      if (updates.role && currentUser.role !== 'admin') {
        throw new Error('Only administrators can update user roles');
      }

      // Prevent users from deactivating themselves
      if (updates.isActive === false && currentUser.id === userId) {
        throw new Error('Users cannot deactivate themselves');
      }

      // Update the user
      const updatedUser = await this.userRepository.update(userId, updates);

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      // Log the update
      console.log(`User ${userId} updated by ${currentUser.id}: ${Object.keys(updates).join(', ')}`);

      return {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          isEmailVerified: updatedUser.isEmailVerified,
          isActive: updatedUser.isActive,
          updatedAt: updatedUser.updatedAt
        },
        message: 'User updated successfully'
      };
    } catch (error) {
      throw new Error(`User update failed: ${error.message}`);
    }
  }
}
