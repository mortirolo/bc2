import React from "react";
// Moved auth logic to middleware
// import { getServerSession, Session } from 'next-auth';  // provides session object for server-side pages
// import { redirect } from "next/navigation";

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import styles from "./page.module.css";
import LoginForm from "./components/auth/LoginForm";

const Home = async () => {
  // We check if there is a session here because we only want to show the home page to non-logged in visitors
  // A logged-in user should be sent directly to their dashboard
  /** MOVED TO MIDDLEWARE 
  * const session: Session | null = await getServerSession(authOptions);
  * 
  * // Redirect to user dashboard if there is a session otherwise, show the login form
  * if (session) {
  *  console.log('Home page.jsx: Session found, redirecting to dashboard');
  *  redirect('/dashboard');
  * }
  */

  return (
    <div className={styles.page}>

      <main className={styles.main}>
        <h1>App Home Page</h1>
        <LoginForm />
      </main>

      <footer className={styles.footer}>
        or <a href="/auth/register">Register</a>
      </footer>
    </div>
  );
}

export default Home;