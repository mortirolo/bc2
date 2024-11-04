import React from 'react';
import LogoutButton from '@/app/components/auth/LogoutButton';
import AutoLogOut from '@/app/components/auth/AutoLogOut';

const emailUpdated = () => {
  return (
    <div >
      <div>Your Email Has Been Updated!</div>
      <div>
        <div>Please log out and log back in for your browser credentials to be updated</div>
        <div>Then, if you have [THE APP] open in any other browser windows, please manually refresh them or close them.</div>
        <LogoutButton />
        <AutoLogOut />
      </div>
    </div>
  );
};

export default emailUpdated;