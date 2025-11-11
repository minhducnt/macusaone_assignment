/**
 * Create User Use Case
 * Handles user creation by administrators
 */
export class CreateUserUseCase {
  constructor(userRepository, authService, emailService, tokenService) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }

  async execute({ email, password, firstName, lastName, role = 'staff' }, createdBy) {
    try {
      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
      }

      // Check if email already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await this.authService.hashPassword(password);

      // Generate email verification token
      const verificationToken = this.tokenService.generateEmailVerificationToken();

      // Create user entity
      const user = await this.userRepository.save({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isEmailVerified: false,
        isActive: true
      });

      // Send verification email
      try {
        await this.emailService.sendEmailVerification(email, {
          firstName,
          verificationToken,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        });
      } catch (emailError) {
        // Log email error but don't fail user creation
        console.error('Failed to send verification email:', emailError);
      }

      // Log the creation
      console.log(`User created by admin ${createdBy}: ${user.id}`);

      // Return user data (without sensitive information)
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: false,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        message: 'User created successfully. Verification email sent.'
      };
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }
}
