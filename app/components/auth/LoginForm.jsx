'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';  // client-side only
import { useEffect } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // DEVEL ONLY =================================
  if (process.env.NODE_ENV === 'development') {
    const pathname = usePathname();
    useEffect(() => {
      console.log('LoginForm.jsx: pathname:', pathname)
    }, [pathname]);
  }
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // Clear previous errors
    setLoading(true);
    console.log('LoginForm: Running handleSubmit')

    try {
      console.log('LoginForm: Calling NextAuth signIn');
      // Use NextAuth's signIn function for credentials
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      console.log('LoginForm: signIn response:', res);

      if (res.ok) {
        console.log('LoginForm: Login successful');
        console.log('LoginForm: Rerouting to /dashboard');
        router.push('/dashboard');
        router.refresh();  // Refreshes app from root so session is updated everywhere
      } else {
        // setError(res.error || 'Login failed');
        setError('Login failed: Incorrect email or password.');
        console.log('LoginForm: Login failed, res.error:', res.error);
      }
    } catch (err) {
      setError('An unexpected error occurred.  Please try again.');
      console.error('An error occurred during login; try/catch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <section>
            <input
              type="text"
              name="email"
              placeholder="email"
              autoComplete="email"
              required
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
          </section>
          <section>
            <input
              type="password"
              name="password"
              placeholder="password"
              autoComplete="current-password"
              required
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
            />
          </section>
          <button type="submit" disabled={loading}>{loading ? "Loggin' ya in...": "Login"}</button>
        </form>
      </main>
    </div>
  );
}

export default LoginForm;
