'use client';

import { useEffect, useState, useTransition } from 'react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const [ref, inView] = useInView();

  const [_, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  const loadMoreDataTweets = async () => {
    try {
      if (currentPage === 0) {
        return startTransition(() => {
          setCurrentPage((prev: number) => prev + 1);
        });
      }
      setIsPending(true);

      const newDataTweets = await getTweetsAction({
        userId,
        page: currentPage,
        isFollowing,
        parentId
      });

      startTransition(() => {
        if (!newDataTweets?.length) {
          return setIsTweetDataMaxed(true);
        }

        setDataTweets((prev: DetailedTweet[] | null) => [
          ...(prev?.length ? prev : []),
          ...newDataTweets
        ]);
        setCurrentPage(prev => prev + 1);
      });
    } catch (error) {
      console.info('[ERROR_LOAD_MORE_DATA_TWEETS]', error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    setDataTweets(initialDataTweets);
    setIsTweetDataMaxed(false);
    setCurrentPage(1);
  }, [initialDataTweets]);

  useEffect(() => {
    if (isPending) return;

    if (inView) {
      loadMoreDataTweets();
    }
  }, [inView]);

  return (
    dataTweets?.length && (
      <>
        {dataTweets?.map(tweet => (
          <Tweets key={tweet.id} tweet={tweet} userId={userId} />
        ))}
        {!isTweetDataMaxed && (
          <section ref={ref}>
            <Loading />
          </section>
        )}
      </>
    )
  );
};

export default ShowTweetsData;
