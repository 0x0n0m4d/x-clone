import { currentUser } from '@clerk/nextjs/server';
import { getTweets } from '@/actions/tweet.action';
import { getUser } from '@/actions/user.action';
import CreateTweetForm from '@/components/forms/CreateTweetForm';
import Topbar from '@/components/home/Topbar';
import TweetsList from '@/components/home/TweetsList';

const Page = async ({ searchParams }: { searchParams: { filter: string } }) => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUser(clerkUser.id);
  if (!user) return null;

  const isFollowing = searchParams.filter === 'following';
  const tweets = await getTweets({ userId: user.id, isFollowing });

  return (
    <div className="relative">
      <Topbar isFollowing={isFollowing} />
      <div className="border-b border-gray-300">
        <CreateTweetForm userId={user.id} imageUrl={user.imageUrl} id="home" />
      </div>
      <TweetsList
        dataTweets={tweets ?? []}
        filter={searchParams.filter}
        userId={user.id}
      />
    </div>
  );
};

export default Page;
