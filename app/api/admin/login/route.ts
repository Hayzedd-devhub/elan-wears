import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { hashPassword, verifyPassword } from '@/lib/util';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      // Create the first admin
      const passwordHash = await hashPassword(password);
      await Admin.create({
        username,
        passwordHash
      });

      return NextResponse.json({ 
        success: true, 
        token: 'admin-token-' + Date.now(),
        message: 'First admin created and logged in successfully' 
      });
    }

    // Authenticate existing admin
    const admin = await Admin.findOne({ username });
    
    if (admin && await verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ 
        success: true, 
        token: 'admin-token-' + Date.now(),
        message: 'Login successful' 
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

