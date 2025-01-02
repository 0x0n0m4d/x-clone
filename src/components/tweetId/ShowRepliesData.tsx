'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getTweetsAction } from '@/actions/tweet.action';
import { MultipleTweetWithConnection } from '@/interfaces/tweet.interface';
import Tweets from '../cards/tweets/Tweets';
import Loading from '../sharing/Loading';

interface Props {
  initialRepliesData: MultipleTweetWithConnection[] | null;
  userId: string;
  isFollowing: boolean;
  parentId: string;
}

const ShowRepliesData = ({
  initialRepliesData: initialReplies,
  userId,
  isFollowing,
  parentId
}: Props) => {
  const [dataTweets, setDataTweets] = useState(initialReplies);

  const [isRepliesDataMaxed, setIsRepliesDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionLoadingRef, inView] = useInView();

  const loadMoreDataTweets = async () => {
    const newDataTweets = await getTweetsAction({
      userId,
      page: currentPage,
      isFollowing,
      parentId
    });

    if (!newDataTweets?.length) {
      setIsRepliesDataMaxed(true);
      return;
    }

    setDataTweets((prev: MultipleTweetWithConnection[] | null) => [
      ...(prev?.length ? prev : []),
      ...newDataTweets
    ]);
    setCurrentPage(prev => prev + 1);
  };

  useEffect(() => {
    setDataTweets(initialReplies);
    setIsRepliesDataMaxed(false);
    setCurrentPage(1);
  }, [initialReplies]);

  useEffect(() => {
    if (inView) {
      loadMoreDataTweets();
    }
  }, [inView]);

  return (
    <>
      {dataTweets?.map(tweet => (
        <Tweets key={tweet.id} tweet={tweet} userId={userId} />
      ))}
      {!isRepliesDataMaxed && (
        <section ref={sectionLoadingRef}>
          <Loading />
        </section>
      )}
    </>
  );
};

export default ShowRepliesData;
