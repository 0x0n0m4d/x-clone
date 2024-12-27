import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserAction, getUsersAction } from '@/actions/user.action';
import ShowUserData from '@/components/explore/ShowUsersData';
import Topbar from '@/components/explore/Topbar';

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || 'message' in user) redirect('/');

  let users = await getUsersAction({
    userId: user.id,
    size: 20
  });

  if (!users || 'message' in users) users = [];

  return (
    <>
      <Topbar user={user} />
      <ShowUserData users={users!} user={user} />
    </>
  );
};

export default Page;
