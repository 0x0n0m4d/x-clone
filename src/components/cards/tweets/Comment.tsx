'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  replyTweet: (isForModal: boolean) => void;
  totalReplies: number;
}

const Comment = ({ replyTweet, totalReplies }: Props) => {
  return (
    <>
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none max-sm:hidden"
        onClick={() => replyTweet(true)}
      >
        <MessageCircle size="20px" />
        <span className="text-sm font-extrabold">{totalReplies}</span>
      </Button>
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none sm:hidden"
        onClick={() => replyTweet(false)}
      >
        <MessageCircle size="20px" />
        <span className="text-sm font-extrabold">{totalReplies}</span>
      </Button>
    </>
  );
};

export default Comment;
