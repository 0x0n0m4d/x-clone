'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  getLikeTweetsByUserId,
  getTweetsByUserIdAction
} from '@/actions/tweet.action';
import { Button } from '../ui/button';

interface Props {
  name: string;
  username: string;
  userId: string;
}

const Topbar = ({ name, username, userId }: Props) => {
  const [title, setTitle] = useState('');
  const [totalTweets, setTotalTweets] = useState('');
  const path = usePathname();

  const getTotalTweets = async () => {
    if (path === `/${username}`) {
      setTitle('Post');

      let tweets = await getTweetsByUserIdAction(userId);
      if (!tweets || 'message' in tweets) tweets = [];

      setTotalTweets(String(tweets.length));
    } else if (path === `/${username}/with_replies`) {
      setTitle('Replies');

      let replies = await getTweetsByUserIdAction(userId, true);
      if (!replies || 'message' in replies) replies = [];

      setTotalTweets(String(replies.length));
    } else {
      setTitle('Likes');

      let likeTweets = await getLikeTweetsByUserId(userId);
      if (!likeTweets || 'message' in likeTweets) likeTweets = [];

      setTotalTweets(String(likeTweets.length));
    }
  };

  useEffect(() => {
    getTotalTweets();
  }, [path]);

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/80">
      <div className="px-3 py-4">
        <div className="flex flex-row items-center gap-x-2">
          <Button
            onClick={() => history.back()}
            variant="icon"
            size="icon"
            className="rounded-full hover:bg-gray-300/50 transition"
          >
            <ArrowLeft size="16" />
          </Button>
          <div className="flex flex-col items-start justify-start">
            <h2 className="font-bold tracking-wide text-xl">{name}</h2>
            <p className="text-sm font-normal text-gray-200">
              {totalTweets} {title}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
