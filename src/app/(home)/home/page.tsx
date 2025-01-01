import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import ShowNotificationsData from '@/components/notifications/ShowNotificationsData';
import NotFound from '@/components/sharing/NotFound';

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/');

  const isFollowing = false;
  let tweets = await getTweetsAction({ userId: user.id, isFollowing });
  if (!tweets?.length) tweets = [];

  return (
    <>
      {tweets.length ? (
        <ShowNotificationsData
          userId={user.id}
          isFollowing={isFollowing}
          initialDataNotifications={tweets}
        />
      ) : (
        <NotFound description="No posts can be displayed" />
      )}
    </>
  );
};

export default Page;
