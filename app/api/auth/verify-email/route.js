import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/app/models/userModel';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  console.log(`API verify-email: Processing login; token: ${token}`);
  try {
    await connectDB();  // Connect to the database as precaution

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    // return NextResponse.json({ message: 'Email verified successfully.' });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/register/email-verified`);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}