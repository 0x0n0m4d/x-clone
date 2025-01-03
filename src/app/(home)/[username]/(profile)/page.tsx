import { currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsAction } from '@/actions/tweet.action';
import { getUserAction, getUserByUsernameAction } from '@/actions/user.action';
import Tweets from '@/components/cards/tweets/Tweets';
import NotFound from '@/components/sharing/404';
import PaginationButtons from '@/components/sharing/PaginationButtons';
import { isValidPage } from '@/lib/utils';

interface Props {
  params: {
    username: string;
  };
  searchParams: {
    page: string;
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
    title: `${user.name} (${user.username})`,
    openGraph: {
      title: `${user.name} (${user.username})`
    }
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const username = params.username;
  const { page: qPage } = searchParams;
  const page = isValidPage(qPage);

  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user) return <NotFound />;

  let tweets = await getTweetsAction({
    userId: user.id,
    isProfile: true,
    page
  });

  return tweets?.data.length ? (
    <>
      {tweets?.data.map(tweet => (
        <Tweets key={tweet.id} tweet={tweet} userId={user.id} />
      ))}
      <PaginationButtons
        currentPage={page}
        currentPath={`/${user.username}`}
        hasNext={tweets.hasNext}
      />
    </>
  ) : null;
};

export default Page;
