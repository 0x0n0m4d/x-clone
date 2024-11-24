import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (!user) return null;

  return (
    <main className="h-full max-w-7xl mx-auto bg-red-500">
      <LeftSidebar username={user.username!} />
      {children}
      <RightSidebar />
    </main>
  );
};

export default layout;
