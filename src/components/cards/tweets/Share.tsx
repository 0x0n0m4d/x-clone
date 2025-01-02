'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { Bookmark } from '@prisma/client';
import { BookmarkMinus, BookmarkPlus, LinkIcon, ShareIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { copyLinkTweet, toggleBookmarkTweet } from '@/lib/tweet';

interface Props {
  userId: string;
  tweetId: string;
  username: string;
  bookmark: Bookmark;
  path: string;
  isDetailTweet?: boolean;
}

const Share = ({
  userId,
  tweetId,
  username,
  bookmark,
  path,
  isDetailTweet
}: Props) => {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="!outline-none p-2 text-gray-200 transition hover:text-blue">
        <ShareIcon size="20px" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="text-blue"
          onClick={() => copyLinkTweet({ toast, username, tweetId })}
        >
          <LinkIcon size="20" />
          Copy Link
        </DropdownMenuItem>
        {!isDetailTweet && (
          <DropdownMenuItem
            onClick={() =>
              toggleBookmarkTweet({
                isPending,
                startTransition,
                toast,
                path,
                bookmark,
                userId,
                threadId: tweetId
              })
            }
          >
            {bookmark ? (
              <BookmarkMinus size="20" />
            ) : (
              <BookmarkPlus size="20" />
            )}
            {bookmark ? 'Delete From Bookmarks' : 'Bookmark'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Share;
