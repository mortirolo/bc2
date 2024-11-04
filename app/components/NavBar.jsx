'use client';
import React from "react";
import Link from "next/link";

import LogoutButton from "@/app/components/auth/LogoutButton";

const NavBar = ({ session }) => {

  return (
    <div >
      <nav className="NavBar">
        <Link key='home' href="/">Home</Link>&nbsp;&nbsp;&nbsp;
        <Link key='about' href="/about-app">About</Link>&nbsp;&nbsp;&nbsp;

        {/** LoginForm must have statement router.refresh() following router.push('/dashboard')
         * to update the session object after login. Otherwise, the session object will not be
         * updated from the root page until the whole app is refreshed manually.
         * In other words, the session object will not be updated in the NavBar component.
         */}
        {!session ? (
          <>
            <Link key='login' href="/auth/login">Login</Link>&nbsp;&nbsp;&nbsp;
            <Link key='register' href="/auth/register">Register</Link>&nbsp;&nbsp;&nbsp;
          </>
        ) : (
          <>
            {/* Make sure session is not null */}
            {session.user && (
              <>
                <Link key='dashboard' href="/dashboard">Dashboard</Link>&nbsp;&nbsp;&nbsp;
                <Link key='profile' href="/user-settings">Settings</Link>
                <LogoutButton />
              </>
            )}
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBar;