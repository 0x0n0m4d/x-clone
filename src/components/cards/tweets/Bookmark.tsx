'use client';

import { useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { Bookmark as Bookmarked } from '@prisma/client';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toggleBookmarkTweet } from '@/lib/tweet';
import { cn } from '@/lib/utils';

interface Props {
  bookmark: Bookmarked;
  path: string;
  userId: string;
  threadId: string;
  totalBookmarks: number;
}

const Bookmark = ({
  bookmark,
  path,
  userId,
  threadId,
  totalBookmarks
}: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="icon"
      size="icon"
      className={cn(
        'flex items-center gap-x-1 transition-all group',
        bookmark ? 'text-blue' : 'text-gray-200 hover:text-blue'
      )}
      onClick={e => {
        e.stopPropagation();
        toggleBookmarkTweet({
          isPending,
          startTransition,
          toast,
          path,
          bookmark,
          userId,
          threadId
        });
      }}
      disabled={isPending}
    >
      {bookmark ? (
        <div className="p-1 group-hover:bg-blue/10 transition-all rounded-full">
          <div className="w-4 h-4">
            <Image
              src="/assets/bookmark-fill-icon.svg"
              alt="Bookmark Fill"
              width={20}
              height={20}
              className="w-4 h-4"
            />
          </div>
        </div>
      ) : (
        <span className="p-2 group-hover:bg-blue/10 transition-all rounded-full">
          <BookmarkIcon className="w-4 h-4" />
        </span>
      )}
      <b>{totalBookmarks}</b>
    </Button>
  );
};

export default Bookmark;
