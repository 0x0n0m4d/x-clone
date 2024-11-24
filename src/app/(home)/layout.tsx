import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-7xl mx-auto bg-red-500">
      LeftSideBar
      {children}
      RightSideBar
    </main>
  );
};

export default layout;
