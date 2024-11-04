import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.SESSION_SECRET });
  const { pathname } = req.nextUrl;

  const loggedOutRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  // Redirect logged-in users from the homepage and other pages that are only for
  // logged-out visitors to the dashboard
  if (loggedOutRoutes.some(route => req.nextUrl.pathname === route)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Define routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/user',
    '/notices/email-updated',
  ];

  // Check if the requested route is a protected route
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    // If the user is not authenticated, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  
  // If the user is authenticated or the route is not protected, continue to the requested page
  return NextResponse.next();
}