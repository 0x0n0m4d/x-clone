import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import Tweets from '@/components/cards/tweets/Tweets';

interface Props {
  searchParams: {
    filter: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || 'message' in user) redirect('/');

  const isFollowing = searchParams.filter === 'following';
  let tweets = await getTweetsAction({ userId: user.id, isFollowing });
  if (!tweets || 'message' in tweets) tweets = [];

  return tweets.map(tweet => (
    <Tweets key={tweet.id} tweet={tweet} userId={user.id} />
  ));
};

export default Page;
