// Seed: Create admin users and sample data

export const run = async (mongoose) => {
  const User = await import('../src/infrastructure/models/user-model.js');
  const { AuthService } = await import('../src/shared/services/auth-service.js');

  console.log('Creating admin users and sample data...');

  try {
    const authService = new AuthService();

    // Create admin user
    const adminExists = await User.default.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedAdminPassword = await authService.hashPassword('Admin123!');
      await User.default.create({
        name: 'System Administrator',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin',
        emailVerified: true,
        isActive: true,
      });
      console.log('Admin user created: admin@example.com');
    } else {
      console.log('Admin user already exists');
    }

    // Create manager user
    const managerExists = await User.default.findOne({ email: 'manager@example.com' });
    if (!managerExists) {
      const hashedManagerPassword = await authService.hashPassword('Manager123!');
      await User.default.create({
        name: 'Department Manager',
        email: 'manager@example.com',
        password: hashedManagerPassword,
        role: 'manager',
        emailVerified: true,
        isActive: true,
      });
      console.log('Manager user created: manager@example.com');
    } else {
      console.log('Manager user already exists');
    }

    // Create sample staff users
    const staffUsers = [
      { name: 'John Staff', email: 'john.staff@example.com' },
      { name: 'Jane Staff', email: 'jane.staff@example.com' },
      { name: 'Bob Staff', email: 'bob.staff@example.com' },
    ];

    for (const staff of staffUsers) {
      const exists = await User.default.findOne({ email: staff.email });
      if (!exists) {
        const hashedStaffPassword = await authService.hashPassword('Staff123!');
        await User.default.create({
          name: staff.name,
          email: staff.email,
          password: hashedStaffPassword,
          role: 'staff',
          emailVerified: true,
          isActive: true,
        });
        console.log(`Staff user created: ${staff.email}`);
      }
    }

    console.log('Admin users and sample data seeding completed');

  } catch (error) {
    console.error('Error seeding admin users:', error);
    throw error;
  }
};
