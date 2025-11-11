// Migration: Add database indexes for better performance

export const up = async (mongoose) => {
  // Get the native MongoDB collection
  const db = mongoose.connection.db;

  try {
    // User collection indexes
    const userCollection = db.collection('users');
    await userCollection.createIndex({ email: 1 }, { unique: true });
    await userCollection.createIndex({ role: 1 });
    await userCollection.createIndex({ isActive: 1 });
    await userCollection.createIndex({ emailVerified: 1 });
    await userCollection.createIndex({ createdAt: -1 });

    // File collection indexes
    const fileCollection = db.collection('files');
    await fileCollection.createIndex({ uploadedBy: 1, createdAt: -1 });
    await fileCollection.createIndex({ category: 1, createdAt: -1 });
    await fileCollection.createIndex({ filename: 1 });
    await fileCollection.createIndex({ originalname: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    // Indexes might already exist, log but don't fail
    if (error.code === 11000) {
      console.log('Some indexes already exist, skipping...');
    } else {
      throw error;
    }
  }
};

export const down = async (mongoose) => {
  // Get the native MongoDB collection
  const db = mongoose.connection.db;

  try {
    // Drop indexes (except the default _id index)
    const userCollection = db.collection('users');
    const fileCollection = db.collection('files');

    // Get all indexes
    const userIndexes = await userCollection.indexes();
    const fileIndexes = await fileCollection.indexes();

    // Drop user indexes (skip _id)
    for (const index of userIndexes) {
      if (index.name !== '_id_') {
        await userCollection.dropIndex(index.name);
      }
    }

    // Drop file indexes (skip _id)
    for (const index of fileIndexes) {
      if (index.name !== '_id_') {
        await fileCollection.dropIndex(index.name);
      }
    }

    console.log('Database indexes dropped successfully');
  } catch (error) {
    console.error('Error dropping indexes:', error);
    throw error;
  }
};
