import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsAction } from '@/actions/tweet.action';
import { getUserByUsernameAction } from '@/actions/user.action';
import ShowRepliesData from '@/components/tweetId/ShowRepliesData';

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

  let initialRepliesData = await getTweetsAction({
    userId: user.id,
    parentId: tweetId,
    isFollowing: false
  });

  return (
    <>
      {initialRepliesData ? (
        <ShowRepliesData
          initialRepliesData={initialRepliesData}
          isFollowing={false}
          parentId={tweetId}
          userId={user.id}
        />
      ) : null}
    </>
  );
};

export default Page;
