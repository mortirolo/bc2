'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    // Use NextAuth's signOut function
    await signOut({ callbackUrl: '/' }); // Redirect to home page after logout
  };

  return <button onClick={handleLogout}>Log Out</button>;
}
