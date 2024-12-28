import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import CreateTweetForm from '@/components/forms/createtweetform/CreateTweetForm';
import Topbar from '@/components/home/Topbar';
import TweetsList from '@/components/home/TweetsList';

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

  return (
    <div className="relative">
      <Topbar isFollowing={isFollowing} user={user} />
      <div className="border-b border-gray-300">
        <CreateTweetForm
          userId={user.id}
          imageUrl={user.imageUrl}
          htmlForId="home"
        />
      </div>
      <TweetsList dataTweets={tweets ?? []} userId={user.id} />
    </div>
  );
};

export default Page;
