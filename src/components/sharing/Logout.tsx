'use client';

import React from 'react';
import { SignOutButton } from '@clerk/nextjs';

const Logout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SignOutButton
      signOutOptions={{ redirectUrl: (window.location.href = '/') }}
    >
      {children}
    </SignOutButton>
  );
};

export default Logout;
