import { ReactNode } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTotalNotificationsAction } from '@/actions/notification.action';
import { getUserAction, getUsersAction } from '@/actions/user.action';
import Modal from '@/components/modals/Modal';
import Bottombar from '@/components/sharing/Bottombar';
import LeftSidebar from '@/components/sharing/leftsidebar/LeftSidebar';
import RightSidebar from '@/components/sharing/rightsidebar/RightSidebar';

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/');

  const isCompleted = user.isCompleted;
  if (!isCompleted) redirect('/onboarding');

  const [users, totalUnreadNotifications] = await Promise.all([
    getUsersAction({ userId: user.id }),
    getTotalNotificationsAction(user.id)
  ]);

  return (
    <main className="max-h-screen overflow-hidden">
      <Modal imageUrl={user.imageUrl} userId={user.id} />
      <section className="h-full max-w-7xl mx-auto flex justify-center">
        <LeftSidebar
          username={user.username}
          name={user.name}
          imageUrl={user.imageUrl}
          totalUnreadNotifications={totalUnreadNotifications ?? 0}
        />
        <section className="hide-scrollbar max-sm:border-none border-l border-r border-gray-300 max-h-screen overflow-y-auto max-sm:pb-32 sm:pb-0 w-full max-sm:max-w-full max-x-[600px]">
          {children}
        </section>
        <RightSidebar users={users?.data!} user={user} />
      </section>
      <Bottombar username={user.username} />
    </main>
  );
};

export default Layout;
