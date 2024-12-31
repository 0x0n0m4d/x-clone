import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getTweetsBySearchAction } from '@/actions/tweet.action';
import { getUserAction, getUsersAction } from '@/actions/user.action';
import Latest from '@/components/search/Latest';
import Media from '@/components/search/Media';
import People from '@/components/search/People';
import Tabs from '@/components/search/Tabs';
import Top from '@/components/search/Top';
import NotFound from '@/components/sharing/NotFound';

interface Props {
  searchParams: {
    q: string;
    f: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  const { q: queryQ, f: queryF } = searchParams;
  if (!queryQ) redirect('/explore');

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || 'message' in user) redirect('/');

  const people = await getUsersAction({
    userId: user.id,
    isOnSearch: true,
    searchQuery: queryQ
  });

  const tweets = await getTweetsBySearchAction({
    searchQuery: queryQ
  });

  const DisplayContent = () => {
    const Comp: any = {
      top: (
        <Top
          currentUser={user}
          queryQ={queryQ}
          people={people}
          tweets={tweets}
        />
      ),
      latest: <Latest userId={user.id} tweets={tweets} />,
      people: <People queryQ={queryQ} people={people} currentUser={user} />,
      media: <Media tweets={tweets} userId={user.id} />,
      notFound: (
        <NotFound
          title={`No results for "${queryQ}"`}
          description="Try searching for something else"
        />
      )
    };

    if (!people?.length && !tweets?.length) return Comp['notFound'];
    if (typeof queryF == 'undefined') return Comp['top'];
    return Comp[queryF.toLowerCase()];
  };

  return (
    <>
      <Tabs />
      <DisplayContent />
    </>
  );
};

export default Page;
