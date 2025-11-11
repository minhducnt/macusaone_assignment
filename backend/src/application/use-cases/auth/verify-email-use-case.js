/**
 * Verify Email Use Case
 * Handles email verification logic
 */
export class VerifyEmailUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ token }) {
    try {
      // Validate input
      if (!token) {
        throw new Error('Verification token is required');
      }

      // Find user by verification token
      const user = await this.userRepository.findByEmailVerificationToken(token);
      if (!user) {
        throw new Error('Invalid or expired verification token');
      }

      // Check if token is expired
      if (user.emailVerificationExpires < new Date()) {
        throw new Error('Verification token has expired');
      }

      // Mark email as verified
      await this.userRepository.update(user.id, {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      });

      return {
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: true
        }
      };
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }
}
