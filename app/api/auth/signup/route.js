import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/user';

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/auth/signup
 * Register a new user with email and password
 */
export async function POST(request) {
  const startTime = Date.now();
  console.log('\x1b[36m%s\x1b[0m', '🚀 Starting signup process...');

  try {
    // Ensure the request has the correct content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { message: 'Content type must be application/json' },
        { status: 415 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    console.log('\x1b[36m%s\x1b[0m', '📝 Validating input...');
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log('\x1b[33m%s\x1b[0m', '🔌 Connecting to database...');
    // Connect to database
    try {
      await connectDB();
      console.log('\x1b[32m%s\x1b[0m', '✓ Database connected successfully');
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', '✗ Database connection error:', error);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    console.log('\x1b[36m%s\x1b[0m', '🔍 Checking for existing user...');
    // Check if user already exists - use lean() for better performance
    const existingUser = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    console.log('\x1b[36m%s\x1b[0m', '🔒 Hashing password...');
    // Hash password with reduced rounds for faster processing (still secure)
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('\x1b[36m%s\x1b[0m', '👤 Creating new user...');
    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: 'credentials',
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    const endTime = Date.now();
    console.log(
      '\x1b[32m%s\x1b[0m',
      `✅ Signup process completed successfully in ${endTime - startTime}ms`
    );

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    const endTime = Date.now();
    console.error(
      '\x1b[31m%s\x1b[0m',
      `❌ Signup error after ${endTime - startTime}ms:`,
      error
    );
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: Object.values(error.errors)[0].message },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 