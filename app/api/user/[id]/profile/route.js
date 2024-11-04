import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/app/models/userModel';

//====================================================
// Get a DB entry
// export async function GET(req: NextRequest, res: NextResponse) {
export async function GET(req, res) {
  // console.log('API, user/[id]: Running GET; req:', req);
  console.log('\nAPI, user/[id]: Running GET');
  const session = await getServerSession(authOptions);
  console.log('API, user/[id]: session:', session);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  console.log('API, user/[id]: Session verified');

  try {
    const result = await User.findById(userId);

    if (!result) {
      return NextResponse.json({ message: 'result not found' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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
  console.log('API, user/[id]: Session verified');

  // revalidatePath('/');  // Revalidate cached data at the root level (all data)
  // return NextResponse.json({ message: 'PUT request received' });

  try {
    // Only update fields that are present in request data (ie. they have changed)
    const updateDoc = {};
    if (payload.name) updateDoc.name = payload.name;
    if (payload.surname) updateDoc.surname = payload.surname;
    if (payload.username) updateDoc.username = payload.username;
    if (payload.profileImage) updateDoc.profileImage = payload.profileImage;
    console.log('API: updateDoc:', updateDoc)
    console.log('API, PUT: Writing update document to DB')
    // revalidatePath('/');  // Revalidate cached data at the root level (all data)
    // return NextResponse.json({ message: 'PUT request received' });

    const updatedUser = await User.findByIdAndUpdate(userId, updateDoc, { new: true });  // FIXME: do we need { new: true }?

    // Check if the document was found and updated
    if (!updatedUser) {
      console.error('API: Document not found or update failed');
      return NextResponse.json({ error: 'Document not found or update failed' }, { status: 404 });
    }
    
    console.log('API: Back from DB')
    console.log('API: updatedUser:', updatedUser)

    revalidatePath('/');  // Revalidate cached data at the root level (all data)
    return NextResponse.json(updatedUser);

  } catch (error) {
    // Log the error and return a 500 status code
    console.error('API: Error updating document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};