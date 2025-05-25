import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose with optimized connection pooling
 * @returns {Promise<Mongoose>} Mongoose connection instance
 */
export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
      );
    }

    if (cached.conn) {
      console.log('✓ Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        // Connection pool settings
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        family: 4, // Use IPv4, skip trying IPv6
      };

      console.log('⚡ Connecting to MongoDB...', process.env.MONGODB_URI);
      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
    }

    try {
      cached.conn = await cached.promise;
      console.log('✓ Successfully connected to MongoDB');
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      console.error('✗ Error connecting to MongoDB:', {
        message: e.message,
        code: e.code,
        name: e.name
      });
      throw e;
    }
  } catch (error) {
    console.error('Detailed MongoDB connection error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    throw new Error('Failed to connect to database: ' + error.message);
  }
} 