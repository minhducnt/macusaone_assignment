/**
 * Register Use Case
 * Handles user registration logic
 */
export class RegisterUseCase {
  constructor(userRepository, authService, emailService, tokenService) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }

  async execute({ email, password, firstName, lastName, role = 'staff' }) {
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
        // Log email error but don't fail registration
        console.error('Failed to send verification email:', emailError);
      }

      // Generate tokens for immediate login
      const accessToken = this.tokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        userId: user.id
      });

      // Return user data and tokens
      return {
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: false,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          tokenType: 'Bearer'
        },
        message: 'Registration successful. Please check your email to verify your account.'
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }
}
