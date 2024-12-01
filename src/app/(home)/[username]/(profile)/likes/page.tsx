import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getLikeTweetsByUserId } from '@/actions/tweet.action';
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

  let likeTweets = await getLikeTweetsByUserId(user.id);
  if (!likeTweets || 'message' in likeTweets) likeTweets = [];

  const isLikeTweetsEmpty = !likeTweets.length;

  const savePostsForLater = () => {
    return (
      <div className="flex justify-center mt-8 px-3">
        <div className="flex flex-col items-start max-w-[300px]">
          <h1 className="text-3xl font-extrabold tracking-wide">
            You don't have any likes yet
          </h1>
          <p className="font-normal text-gray-200">
            Tap the heart on any post to show it some love. When you do, it'll
            show up here.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLikeTweetsEmpty
        ? savePostsForLater()
        : likeTweets.map(tweet => (
            <Tweets key={tweet.id} tweet={tweet} userId={currentUser.id} />
          ))}
    </>
  );
};

export default Page;
