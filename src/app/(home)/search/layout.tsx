import { ReactNode, Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserAction } from '@/actions/user.action';
import Topbar from '@/components/search/Topbar';
import Loading from '@/components/sharing/Loading';

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/');

  return (
    <>
      <Topbar user={user} />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
};

export default Layout;
