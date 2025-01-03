import { ReactNode } from 'react';
import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTotalTweetsAction } from '@/actions/tweet.action';
import { getUserAction, getUserByUsernameAction } from '@/actions/user.action';
import Tabs from '@/components/profile/Tabs';
import Topbar from '@/components/profile/Topbar';
import UserProfile from '@/components/profile/UserProfile';
import NotFound from '@/components/sharing/404';
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile';

interface Props {
  children: ReactNode;
  params: {
    username: string;
  };
}

export const generateMetadata = async ({ params }: Props) => {
  const { username } = params;
  const user = await getUserByUsernameAction(username);

  if (!user) {
    return {
      title: 'Profile'
    };
  }

  return {
    description: user.bio,
    openGraph: {
      description: user.bio,
      type: 'profile',
      images: [user.imageUrl],
      siteName: 'X (formelry twitter)',
      url: `${process.env.NEXT_PUBLIC_NEXT_URL}/${user.username}`
    }
  };
};

const Layout = async ({ children, params }: Props) => {
  const username = params.username;

  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user) return <NotFound />;

  const [totalTweets, totalReplies, totalLikes] = await Promise.all([
    getTotalTweetsAction({ userId: user.id, isProfile: true }),
    getTotalTweetsAction({ userId: user.id, isProfile: true, isReplies: true }),
    getTotalTweetsAction({ userId: user.id, isProfile: true, isLikes: true })
  ]);

  return (
    <>
      <ButtonCreatePostMobile />
      <Topbar
        name={user.name}
        username={user.username}
        totalTweets={totalTweets ?? 0}
        totalReplies={totalReplies ?? 0}
        totalLikes={totalLikes ?? 0}
      />
      <UserProfile
        isMyProfile={currentUser.id === user.id}
        user={user}
        currentUser={{ id: currentUser.id, username: currentUser.username }}
      />
      <Tabs username={user.username} />
      {children}
    </>
  );
};

export default Layout;
