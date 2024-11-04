import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import connectDB from '@/lib/db';
import User from '@/app/models/userModel';


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Connect to the database
        await connectDB();

        // Check if the user exists
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password
        const isValid = await user.matchPassword(credentials.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return user; // Return the user object
      }
    }),
  ],
  adapter: MongoDBAdapter(connectDB()),
  session: {
    strategy: 'jwt',
  },
  pages: {
    // Custom pages if needed
    // signIn: '/auth/login', // Custom login page (optional)
    // error: '/auth/error', // Custom error page (optional)
  },
  callbacks: {
    // For JWT authentication
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id; // Store user ID in JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // Add user id to session
      }
      return session;
    },
  },
  secret: process.env.SESSION_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Export GET and POST methods
