import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

import connectDB from '@/lib/db.js';
import User from '@/app/models/userModel';

export async function POST(req) {
  const payload = await req.json();
  const email = payload.email;
  const password = payload.password;
  console.log('API register: payload:', payload)
  console.log(`API register: email: ${email}, password: ${password}`)  // FIXME: remove password from log

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Connect to the database
  await connectDB();

  try {
    // Check if the user already exists
    console.log('API register: Check if email already exists');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('API register: Email already exists');
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    // Create a new user
    console.log('API register: Create new user');
    const newUser = await User.create({
      name: payload.name,
      surname: payload.surname,
      username: payload.username,
      email: email,
      password: password,
      verified: false,  // FIXME: remove to test email verification
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    console.log('API register: Generated verification token:', verificationToken);
    newUser.verificationToken = verificationToken;
    await newUser.save();

    // Initialize the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'gmail'
      // Below 3 properties for configuring custom SMTP server
      // Nodemailer will use the default Gmail SMTP server if these are not provided
      // host: process.env.EMAIL_HOST, // Use the environment variables
      // port: process.env.EMAIL_PORT || 587, // 587 is the default port for TLS
      // secure: false, // Use TLS (false for Gmail, SendGrid, etc.)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create URL that the user can click to verify their email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send the verification email
    console.log('API register: Sending verification email with link:', verificationUrl);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your account. This link expires in 1 hour.</p><p>Link: ${verificationUrl}</p>`,
    });

    console.log('API: Finished creating new user account')
    return NextResponse.json({ message: "Verification email sent" }, { status: 201 });
} catch (error) {
    console.error(error);
    // return NextResponse.json({ message: "Server error" }, { status: 500 });
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
