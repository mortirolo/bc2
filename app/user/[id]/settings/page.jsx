import { getServerSession } from 'next-auth';  // provides session object for server-side pages
// import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserSettings from "@/app/components/user/UserSettings";
// import User from '@/app/models/userModel';
import { getSanitizedUserData } from '@/utils/dbUtils';


const userSettingsPage = async () => {
  const session = await getServerSession(authOptions);
  if (process.env.NODE_ENV === 'development') { console.log('user/settings/page.jsx: session:', session) };

  // Moved auth logic to middleware
  // if (!session) {
  //   // Redirect to login if no session (user not logged in)
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('dashboard/page.jsx: No session. Redirecting to Login page')
  //   };
  //   redirect('/auth/login');
  // }

  try {
    // Fetch user data from DB from this page.  Calling api not needed and we can't
    // send the client token anyway.  API is for client-side requests.
    const user = await getSanitizedUserData(session.user.id);
    console.log(`user/settings/page: typeof(user): ${typeof(user)}\n user: ${user}`);
    return (
      <div>
        <strong>{session.user.email}, {session.user.id}</strong>
        <UserSettings user={user}/>
        {/* <UserSettings /> */}
      </div>
    );
  } catch (error) {
    console.error('Error rendering user settings page:', error);
    return (
      <div>
        <p>Error loading user settings. Please try again later.</p>
      </div>
    );
  }
};

export default userSettingsPage;