import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/app/models/userModel';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  console.log(`\nAPI update-email/verify: Processing token; token: ${token}`);
  try {
    await connectDB();  // Connect to the database as precaution

    const user = await User.findOne({ updateEmailToken: token });
    console.log('API update-email/verify: user:', user);
    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }
    // Make sure there is a new email to update
    if (!user.tempNewEmail) {
      console.error('API update-email/verify: No new email found.');
      return NextResponse.json({ message: 'No new email found.' }, { status: 400 });
    }
    user.email = user.tempNewEmail;
    user.tempNewEmail = undefined;
    user.updateEmailToken = undefined;
    await user.save();
    // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/register/email-verified`);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/notices/email-updated`);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}