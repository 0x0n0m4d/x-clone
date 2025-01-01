import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetAction } from '@/actions/tweet.action';
import { getUserByUsernameAction } from '@/actions/user.action';
import ShowTweetsData from '@/components/home/ShowTweetsData';

interface Props {
  params: {
    tweetId: string;
  };
}

const Page = async ({ params }: Props) => {
  const { tweetId } = params;

  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const user = await getUserByUsernameAction(clerkUser.id);
  if (!user) return redirect('/');

  let initialDataTweets: any = await getTweetAction(tweetId);
  initialDataTweets = initialDataTweets?.replies || [];

  return (
    <>
      {initialDataTweets ? (
        <ShowTweetsData
          initialDataTweets={initialDataTweets}
          isFollowing={false}
          userId={user.id}
        />
      ) : null}
    </>
  );
};

export default Page;
