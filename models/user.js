import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema for MongoDB
 * Stores user information including authentication details and profile data
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
  },
  image: String,
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Only create the model if it doesn't exist
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 