'use client';

import { useSession } from 'next-auth/react';
import { useAppContext } from './context/AppProvider';
import { useEffect } from 'react';
import { User } from '@/types/session';
import { getUserData } from '@/services/apiGetData';

export default function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser } = useAppContext();

  // Fetch the user's data from the database when session changes
  useEffect(() => {
    async function fetchUserData() {
      if (status === 'loading' || !session?.user?.email) {
        return;
      }

      try {
        // Get extended user data from database
        const userDataFromDB = await getUserData(session.user.email);

        if (userDataFromDB) {
          // User found in database, use that data
          setUser(userDataFromDB);
        } else {
          // Create basic user object from session
          const basicUserData: User = {
            name: session.user.name || '',
            email: session.user.email,
            image: session.user.image || '',
            recent_rides: [], // Initialize with empty array
          };
          setUser(basicUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to basic session data
        if (session?.user?.email) {
          setUser({
            name: session.user.name || '',
            email: session.user.email,
            image: session.user.image || '',
            recent_rides: [],
          });
        }
      }
    }

    fetchUserData();

    // When session is gone or user logs out, set user to null
    if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status, setUser]);

  return null; // This component doesn't render anything vi
}
