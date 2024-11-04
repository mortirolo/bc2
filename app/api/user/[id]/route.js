import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/app/models/userModel';

export async function GET(req, res) {
  // console.log('API, user/[id]: Running GET; req:', req);
  console.log('API, user/[id]: Running GET');
  // const session = await getServerSession({ req, res: NextResponse, authOptions });
  // const session = await getServerSession({ req, res: NextResponse }, authOptions);
  // const session = await getServerSession(req, res: NextResponse, authOptions);
  const session = await getServerSession(req, res, authOptions);
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