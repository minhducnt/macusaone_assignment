/**
 * Delete User Use Case
 * Handles user deletion (soft delete by deactivating)
 */
export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, currentUser) {
    try {
      // Validate input
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Find the user to delete
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check permissions
      const canDelete = currentUser.role === 'admin' ||
                       (currentUser.role === 'manager' && user.role === 'staff');

      if (!canDelete) {
        throw new Error('Insufficient permissions to delete this user');
      }

      // Prevent users from deleting themselves
      if (currentUser.id === userId) {
        throw new Error('Users cannot delete themselves');
      }

      // Prevent deleting other administrators
      if (user.role === 'admin' && currentUser.role !== 'admin') {
        throw new Error('Only administrators can delete other administrators');
      }

      // Soft delete by deactivating the user
      const deletedUser = await this.userRepository.update(userId, {
        isActive: false
      });

      if (!deletedUser) {
        throw new Error('Failed to delete user');
      }

      // Log the deletion
      console.log(`User ${userId} deactivated by ${currentUser.id}`);

      return {
        message: 'User deleted successfully',
        userId: userId
      };
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }
}
