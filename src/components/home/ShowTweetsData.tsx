'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getTweetsAction } from '@/actions/tweet.action';
import { DetailedTweet } from '@/interfaces/tweet.interface';
import Tweets from '../cards/tweets/Tweets';
import Loading from '../sharing/Loading';

interface Props {
  initialDataTweets: DetailedTweet[] | null;
  userId: string;
  isFollowing: boolean;
  parentId?: string;
}

const ShowTweetsData = ({
  initialDataTweets,
  userId,
  isFollowing,
  parentId
}: Props) => {
  const [dataTweets, setDataTweets] = useState(initialDataTweets);

  const [isTweetDataMaxed, setIsTweetDataMaxed] = useState(false);
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
      setIsTweetDataMaxed(true);
      return;
    }

    setDataTweets((prev: DetailedTweet[] | null) => [
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
