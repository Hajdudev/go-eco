import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
// import supabase from './services/supabaseClient';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session?.user?.email) {
        try {
        } catch (error) {
          console.error('Unexpected error in session callback:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});
