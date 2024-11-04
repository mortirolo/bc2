'use client'
import React, { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AutoLogOut = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      signOut();
      router.push('/');
      router.refresh();
    }, 5000); // 5 second delay

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return null;
};

  export default AutoLogOut;