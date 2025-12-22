// dropResetTokenIndex.js
// Run this script once to drop the resetToken unique index
// Usage: node dropResetTokenIndex.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropResetTokenIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop the resetToken_1 index
    await usersCollection.dropIndex('resetToken_1');
    console.log('✅ Successfully dropped resetToken_1 index');

    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    if (error.code === 27 || error.message.includes('index not found')) {
      console.log('ℹ️  Index resetToken_1 does not exist (already dropped or never created)');
    } else {
      console.error('❌ Error dropping index:', error.message);
    }
    await mongoose.connection.close();
    process.exit(1);
  }
};

dropResetTokenIndex();
