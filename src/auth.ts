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
  // callbacks: {
  //   async session({ session }) {
  //     if (session?.user?.email) {
  //       try {
  //         console.log(`Processing session for email: ${session.user.email}`);

  //         // First check if user exists using email
  //         const { data: existingUser, error: fetchError } = await supabase
  //           .from('users')
  //           .select('*')
  //           .eq('email', session.user.email);

  //         // Check if we found any users
  //         if (fetchError) {
  //           console.error('Error checking for user:', fetchError);
  //           return session;
  //         }

  //         console.log(
  //           `Found ${existingUser?.length || 0} existing users for email: ${session.user.email}`,
  //         );

  //         // If user doesn't exist, create a new record
  //         if (!existingUser || existingUser.length === 0) {
  //           console.log(`Creating new user for email: ${session.user.email}`);

  //           // Check if we already have a user with this email one more time to avoid race conditions
  //           const { data: doubleCheckUser } = await supabase
  //             .from('users')
  //             .select('*')
  //             .eq('email', session.user.email);

  //           if (doubleCheckUser && doubleCheckUser.length > 0) {
  //             console.log(
  //               `Found user on double check for ${session.user.email}`,
  //             );
  //             session.user.id = doubleCheckUser[0].id;
  //             return session;
  //           }

  //           const { data: newUser, error: insertError } = await supabase
  //             .from('users')
  //             .insert([
  //               {
  //                 email: session.user.email,
  //                 name: session.user.name,
  //                 image: session.user.image,
  //               },
  //             ])
  //             .select();

  //           if (insertError) {
  //             console.error('Error creating new user:', insertError);
  //           } else if (newUser && newUser.length > 0) {
  //             console.log(
  //               `Successfully created new user with ID: ${newUser[0].id}`,
  //             );
  //             session.user.id = newUser[0].id;
  //           }
  //         } else {
  //           // User exists, add their ID to the session
  //           console.log(`Using existing user with ID: ${existingUser[0].id}`);
  //           session.user.id = existingUser[0].id;
  //         }
  //       } catch (error) {
  //         console.error('Unexpected error in session callback:', error);
  //       }
  //     }
  //     return session;
  //   },
  // },
  pages: {
    signIn: '/auth/signin',
  },
});
