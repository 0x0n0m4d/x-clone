import React from 'react';
import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserAction, getUserByUsernameAction } from '@/actions/user.action';
import NotFound from '@/components/404';
import Tabs from '@/components/profile/Tabs';
import Topbar from '@/components/profile/Topbar';
import UserProfile from '@/components/profile/UserProfile';

interface Props {
  children: React.ReactNode;
  params: {
    username: string;
  };
}

const Layout = async ({ children, params }: Props) => {
  const username = params.username;

  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser || 'message' in currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user || 'message' in user) return <NotFound />;

  return (
    <>
      <Topbar name={user.name} username={user.username} userId={user.id} />
      <UserProfile
        isMyProfile={currentUser.id === user.id}
        user={user}
        currentUser={{ id: currentUser.id, username: currentUser.username }}
      />
      <Tabs username={user.username} />
      {children}
    </>
  );
};

export default Layout;
