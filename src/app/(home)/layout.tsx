import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserAction, getUsersAction } from '@/actions/user.action';
import Bottombar from '@/components/Bottombar';
import LeftSidebar from '@/components/LeftSidebar';
import Modal from '@/components/modals/Modal';
import RightSidebar from '@/components/RightSidebar';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || 'message' in user) redirect('/');

  const isCompleted = user.isCompleted;
  if (!isCompleted) redirect('/onboarding');

  let users = await getUsersAction({ userId: user.id });
  if (!users || 'message' in users) users = [];

  return (
    <main>
      <Modal imageUrl={user.imageUrl} userId={user.id} />
      <section className="h-full max-w-7xl mx-auto flex">
        <LeftSidebar
          username={user.username}
          name={user.name}
          imageUrl={user.imageUrl}
        />
        <section className="w-full hide-scrollbar max-h-screen overflow-y-auto">
          {children}
        </section>
        <RightSidebar users={users} user={user} />
      </section>
      <Bottombar />
    </main>
  );
};

export default layout;
