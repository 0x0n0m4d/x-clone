import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserAction, getUsersAction } from '@/actions/user.action';
import ShowUserData from '@/components/explore/ShowUsersData';

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/');

  let users = await getUsersAction({
    userId: user.id,
    size: 20
  });

  if (!users?.length) users = [];

  return (
    <>
      <ShowUserData initialDataUsers={users!} user={user} />
    </>
  );
};

export default Page;
