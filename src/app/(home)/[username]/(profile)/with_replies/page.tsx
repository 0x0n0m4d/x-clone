import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsByUserIdAction } from '@/actions/tweet.action';
import { getUserAction, getUserByUsernameAction } from '@/actions/user.action';
import NotFound from '@/components/404';
import Tweets from '@/components/cards/Tweets';

interface Props {
  params: {
    username: string;
  };
}

const Page = async ({ params }: Props) => {
  const username = params.username;

  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser || 'message' in currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user || 'message' in user) return <NotFound />;

  let replies = await getTweetsByUserIdAction(user.id, true);
  if (!replies || 'message' in replies) replies = [];

  return (
    <>
      {replies.map(tweet => (
        <Tweets key={tweet.id} tweet={tweet} userId={currentUser.id} />
      ))}
    </>
  );
};

export default Page;
