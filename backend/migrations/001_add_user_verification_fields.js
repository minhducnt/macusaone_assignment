// Migration: Add email verification and password reset fields to User model

export const up = async (mongoose) => {
  // Get the native MongoDB collection
  const db = mongoose.connection.db;
  const collection = db.collection('users');

  // Add new fields to all existing users
  await collection.updateMany(
    {},
    {
      $set: {
        emailVerified: true, // Set existing users as verified
        emailVerificationToken: null,
        emailVerificationExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    }
  );

  console.log('Added verification fields to all existing users');
};

export const down = async (mongoose) => {
  // Get the native MongoDB collection
  const db = mongoose.connection.db;
  const collection = db.collection('users');

  // Remove the new fields
  await collection.updateMany(
    {},
    {
      $unset: {
        emailVerified: 1,
        emailVerificationToken: 1,
        emailVerificationExpires: 1,
        passwordResetToken: 1,
        passwordResetExpires: 1,
      }
    }
  );

  console.log('Removed verification fields from all users');
};
