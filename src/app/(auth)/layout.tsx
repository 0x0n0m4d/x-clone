import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <main className="h-screen grid place-items-center">{children}</main>;
};

export default Layout;
