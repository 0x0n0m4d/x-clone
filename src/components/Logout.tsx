'use client';

import { SignOutButton } from '@clerk/nextjs';

const Logout = () => {
  return (
    <SignOutButton
      signOutOptions={{ redirectUrl: (window.location.href = '/') }}
    />
  );
};

export default Logout;
