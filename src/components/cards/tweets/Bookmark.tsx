'use client';

import { useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { Bookmark as Bookmarked } from '@prisma/client';
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
        'flex items-center gap-x-2 transition',
        bookmark ? 'text-blue' : 'text-gray-200 hover:text-blue'
      )}
      onClick={() =>
        toggleBookmarkTweet({
          isPending,
          startTransition,
          toast,
          path,
          bookmark,
          userId,
          threadId
        })
      }
      disabled={isPending}
    >
      {bookmark ? (
        <Image
          src="/assets/bookmark-fill-icon.svg"
          alt="Bookmark Fill"
          width={20}
          height={20}
          className="object-contain"
        />
      ) : (
        <Image
          src="/assets/bookmark-icon.svg"
          alt="Bookmark Fill"
          width={20}
          height={20}
          className="object-contain"
        />
      )}
      <span className="text-sm font-extrabold">{totalBookmarks}</span>
    </Button>
  );
};

export default Bookmark;
