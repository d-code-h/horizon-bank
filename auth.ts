import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';
import { setUser } from './app/store/userStore';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async (
        credentials: Partial<Record<'email' | 'password', unknown>>
      ) => {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          switch (data.status) {
            case 200:
              const { _id, firstName, lastName, email } = data.user;
              setUser({ $id: _id, name: `${firstName} ${lastName}`, email });
              return {
                id: _id,
                name: `${firstName} ${lastName}`,
                email,
              };

            case 401:
              throw new Error(JSON.stringify(data));
            default:
              return null; // Handle unexpected statuses
          }
        } catch (error) {
          console.error('Authorization error:', error); // Log the error for debugging
          return null; // Return null on error
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
});
