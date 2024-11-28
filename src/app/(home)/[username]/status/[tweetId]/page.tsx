import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import NotFound from '@/components/404';
import Tweets from '@/components/cards/Tweets';
import CreateTweetForm from '@/components/forms/CreateTweetForm';
import DetailTweet from '@/components/tweetId/DetailTweet';
import Topbar from '@/components/tweetId/Topbar';

interface Props {
  params: {
    username: string;
    tweetId: string;
  };
}

const Page = async ({ params }: Props) => {
  const tweetId = params.tweetId;
  const username = params.username;

  const dataTweet = await getTweetAction(tweetId);
  if (!dataTweet || 'message' in dataTweet) return <NotFound />;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || 'message' in user) redirect('/');

  const isValidUsername = user.username === username;
  if (!isValidUsername) return <NotFound />;

  return (
    <div className="relative">
      <Topbar />
      <DetailTweet tweet={dataTweet} userId={user.id} />
      <div className="border-b border-gray-300">
        <CreateTweetForm
          userId={user.id}
          imageUrl={user.imageUrl}
          isReply
          htmlForId="tweetId"
          dataTweet={dataTweet}
          parentId={dataTweet.id}
        />
      </div>
      {dataTweet.replies.map(tweet => (
        <Tweets key={tweet.id} tweet={tweet} userId={user.id} />
      ))}
    </div>
  );
};

export default Page;
