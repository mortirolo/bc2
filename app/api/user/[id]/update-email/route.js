import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/app/models/userModel';

//====================================================
// Update DB entry
// export async function PUT(req: NextRequest, res: NextResponse) {
export async function PUT(req, res) {
  console.log('\nAPI, user/[id]: Running PUT for document update');
  const payload = await req.json();
  console.log('API, user/[id]: req data:', payload);

  const session = await getServerSession(authOptions);
  console.log('API, user/[id]: session:', session);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  console.log(`API, user/[id]: Session verified; userId: ${userId}`);

  // revalidatePath('/');  // Revalidate cached data at the root level (all data)
  // return NextResponse.json({ message: 'PUT request received' });

  try {
    // Only update fields that are present in request data (ie. they have changed)
    const updateDoc = {};
    if (payload.tempNewEmail) {
      // Add redundant email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.tempNewEmail)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
      updateDoc.tempNewEmail = payload.tempNewEmail;
    }

    // Generate verification token
    const updateEmailToken = crypto.randomBytes(20).toString('hex');
    updateDoc.updateEmailToken = updateEmailToken;
    console.log('API PUT: Generated verification token:', updateEmailToken);

    console.log('API, PUT: updateDoc:', updateDoc)
    // revalidatePath('/');  // Revalidate cached data at the root level (all data)
    // return NextResponse.json({ message: 'PUT request received' });

    console.log('API, PUT: Writing update document to DB')
    const updatedUser = await User.findByIdAndUpdate(userId, updateDoc, { new: true });  // new:true returns modified doc, not orig doc

    // Check if the document was found and updated
    if (!updatedUser) {
      console.error('API: Document not found or update failed');
      return NextResponse.json({ error: 'Document not found or update failed' }, { status: 404 });
    }
    
    const tempNewEmail = updatedUser.tempNewEmail;
    console.log('API, PUT: Back from DB')
    console.log(`API, PUT: tempNewEmail: ${tempNewEmail}\nupdatedUser: ${updatedUser}`)

    // revalidatePath('/');  // Revalidate cached data at the root level (all data)
    // return NextResponse.json(updatedUser);

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
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/user/${userId}/update-email/verify?token=${updateEmailToken}`;

    // Send the verification email
    console.log(`API register: Sending verification email to ${tempNewEmail} with link: ${verificationUrl}`);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: tempNewEmail,
      subject: "Verify your new email",
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your new email address otherwise,
             it will not take effect. This link expires in 1 hour.</p><p>Link: ${verificationUrl}</p>`,
    });

    console.log('API: Finished creating temporary new email address; must be verified by user')
    return NextResponse.json({ message: "Verification email sent" }, { status: 201 });
  } catch (error) {
    // Log the error and return a 500 status code
    console.error('API: Error updating document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};


//====================================================
// Get a DB entry
// export async function GET(req: NextRequest, res: NextResponse) {
// export async function GET(req, res) {
//   // console.log('API, user/[id]: Running GET; req:', req);
//   console.log('\nAPI, user/[id]: Running GET');
//   const session = await getServerSession(authOptions);
//   console.log('API, user/[id]: session:', session);

//   if (!session) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   const userId = session.user.id;
//   console.log('API, user/[id]: Session verified');

//   try {
//     const result = await User.findById(userId);

//     if (!result) {
//       return NextResponse.json({ message: 'result not found' }, { status: 404 });
//     }

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }
