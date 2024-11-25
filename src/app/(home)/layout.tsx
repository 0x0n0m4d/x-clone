import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUser } from '@/actions/user.action';
import Bottombar from '@/components/Bottombar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const user = await getUser(clerkUser.id);

  const isCompleted = user && user.isCompleted;
  if (!isCompleted) redirect('/onboarding');

  return (
    <main>
      <section className="h-full max-w-7xl mx-auto flex">
        <LeftSidebar
          username={user.username}
          name={user.name}
          imageUrl={user.imageUrl}
        />
        {children}
        <RightSidebar />
      </section>
      <Bottombar />
    </main>
  );
};

export default layout;
