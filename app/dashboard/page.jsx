import React from 'react';
import { getServerSession } from 'next-auth';  // provides session object for server-side pages
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { redirect } from 'next/navigation';

import Dashboard from '../components/dashboard/Dashboard';

// const userDashboard: React.FC = async () => {
const userDashboard = async () => {
  // Get session to display user info in the dashboard
  const session = await getServerSession(authOptions);
  if (process.env.NODE_ENV === 'development') { console.log('dashboard/page.jsx: session:', session) };

  // Moved auth logic to middleware
  // if (!session) {
  //   // Redirect to login if no session (user not logged in)
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log('dashboard/page.jsx: No session. Redirecting to Login page')
  //   };
  //   redirect('/auth/login');
  // }

  return(
    <div>
      <h4>{session.user.email}, {session.user.id}</h4>
      <Dashboard />
    </div>
  );
}

export default userDashboard;