import React from 'react';

const signUpSuccess = () => {
  return (
    <div >
      <div>Success!</div>
      <div>
        <div>Account Created</div>
        <div>
          A link was sent to your email.  Please click on the link to activate your new account before logging in.
        </div>
        <h3><a href='/auth/login'>Login</a></h3>
      </div>
    </div>
  );
};

export default signUpSuccess;