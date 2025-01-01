'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getTweetsAction } from '@/actions/tweet.action';
import { MultipleTweetWithConnection } from '@/interfaces/tweet.interface';
import Tweets from '../cards/tweets/Tweets';
import Loading from '../sharing/Loading';

interface Props {
  initialDataTweets: MultipleTweetWithConnection[] | null;
  userId: string;
  isFollowing: boolean;
}

const ShowTweetsData = ({ initialDataTweets, userId, isFollowing }: Props) => {
  const [dataTweets, setDataTweets] = useState(initialDataTweets);

  const [isTweetDataMaxed, setIsTweetDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionLoadingRef, inView] = useInView();

  const loadMoreDataTweets = async () => {
    const newDataTweets = await getTweetsAction({
      userId,
      page: currentPage,
      isFollowing
    });

    if (!newDataTweets?.length) {
      setIsTweetDataMaxed(true);
      return;
    }

    setDataTweets((prev: MultipleTweetWithConnection[] | null) => [
      ...(prev?.length ? prev : []),
      ...newDataTweets
    ]);
    setCurrentPage(page => page + 1);
  };

  useEffect(() => {
    setDataTweets(initialDataTweets);
    setIsTweetDataMaxed(false);
    setCurrentPage(1);
  }, [initialDataTweets]);

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
      {!isTweetDataMaxed && (
        <section ref={sectionLoadingRef}>
          <Loading />
        </section>
      )}
    </>
  );
};

export default ShowTweetsData;
