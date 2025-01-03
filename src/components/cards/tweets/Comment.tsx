'use client';

import { MouseEvent } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  replyTweet: (isForModal: boolean) => void;
  totalReplies: number;
}

const Comment = ({ replyTweet, totalReplies }: Props) => {
  const replyTweetHandler = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    replyTweet(true);
  };

  return (
    <>
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-1 text-gray-200 transition hover:text-blue !outline-none max-sm:hidden group"
        onClick={replyTweetHandler}
      >
        <span className="p-2 group-hover:bg-blue/10 rounded-full">
          <MessageCircle className="h-4 w-4" />
        </span>
        <b>{totalReplies}</b>
      </Button>
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none sm:hidden group"
        onClick={replyTweetHandler}
      >
        <span className="p-2 group-hover:bg-blue/10 rounded-full">
          <MessageCircle className="h-4 w-4" />
        </span>
        <b>{totalReplies}</b>
      </Button>
    </>
  );
};

export default Comment;
