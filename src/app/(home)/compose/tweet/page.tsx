import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserAction } from '@/actions/user.action';
import ShowCreateTweetForm from '@/components/compose/tweet/ShowCreateTweetForm';

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || 'message' in user) redirect('/');

  return (
    <>
      <ShowCreateTweetForm userId={user.id} imageUrl={user.imageUrl} />
    </>
  );
};

export default Page;