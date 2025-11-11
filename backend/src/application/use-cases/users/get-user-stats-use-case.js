/**
 * Get User Stats Use Case
 * Handles retrieving user statistics
 */
export class GetUserStatsUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    try {
      const stats = await this.userRepository.getUserStats();

      return {
        stats: {
          totalUsers: stats.totalUsers,
          activeUsers: stats.activeUsers,
          verifiedUsers: stats.verifiedUsers,
          usersByRole: stats.usersByRole,
          recentRegistrations: stats.recentRegistrations,
          verificationRate: stats.totalUsers > 0 ?
            Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }
}
