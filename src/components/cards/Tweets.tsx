'use client';

import { useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import {
  ArrowUpRight,
  BookmarkMinus,
  BookmarkPlus,
  Heart,
  LinkIcon,
  MessageCircle,
  MoreHorizontal,
  Share,
  Trash,
  UserPlus2,
  UserX2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTweetModal } from '@/hooks/useTweetModal';
import {
  DataTweet,
  MultipleTweetWithConnection
} from '@/interfaces/tweet.interface';
import {
  copyLinkTweet,
  deleteTweet,
  renderText,
  toggleBookmarkTweet,
  toggleLikeTweet
} from '@/lib/tweet';
import { toggleFollowUser } from '@/lib/user';
import { cn, customDatePost } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

interface Props {
  tweet: MultipleTweetWithConnection;
  userId: string;
}

const Tweets = ({ tweet, userId }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const tweetModal = useTweetModal();
  const pathname = usePathname();

  const [isPendingLike, startTransitionLike] = useTransition();
  const [isPendingFollowUser, startTransitionFollowUser] = useTransition();
  const [isPendingBookmark, startTransitionBookmark] = useTransition();
  const [isPendingTweet, startTransitionTweet] = useTransition();

  const liked = tweet.likes.find(like => like.userId === userId);
  const followed = tweet.user.followers.find(
    ({ followingId }) => followingId === userId
  );
  const bookmark = tweet.bookmarks.find(item => item.userId === userId);

  const replyTweet = () => {
    const dataTweet: DataTweet = {
      id: tweet.id,
      text: tweet.text,
      imageUrl: tweet.imageUrl,
      createdAt: tweet.createdAt,
      user: {
        name: tweet.user.name,
        username: tweet.user.username,
        imageUrl: tweet.user.imageUrl
      }
    };

    tweetModal.setParentId(tweet.id);
    tweetModal.setDataTweet(dataTweet);
    tweetModal.onOpen();
  };

  const formattedCreatedAt =
    tweet.createdAt && customDatePost(tweet.createdAt.getTime());

  const isOwnTweet = tweet.userId === userId;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex gap-x-5 px-3 py-4 border-b border-b-gray-300 transition">
      <div className="flex items-start justify-start rounded-full overflow-hidden">
        <Image
          src={tweet.user.imageUrl}
          alt={tweet.user.name}
          width={35}
          height={35}
          priority
          className="object-cover rounded-full w-[35px] h-[35px]"
        />
      </div>
      <div className="flex-1 flex flex-col space-y-10">
        <div className="flex-1 flex justify-between">
          <div className="flex-1 flex flex-col gap-y-5">
            <div className="flex-1 flex items-center flex-wrap gap-x-2">
              <h5 className="text-ellipsis overflow-hidden whitespace-nowrap font-bold text-white w-fit max-w-[150px]">
                {tweet.user.name}
              </h5>
              <p className="text-ellipsis whitespace-nowrap font-normal text-gray-200">
                @{tweet.user.username} · {formattedCreatedAt}
              </p>
            </div>
            <p className="whitespace-break-spaces">{renderText(tweet.text)}</p>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full">
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem>
                  <Link
                    href={`/${tweet.user.username}/status/${tweet.id}`}
                    className="flex items-center gap-x-2 w-full"
                  >
                    <ArrowUpRight size="20" />
                    Go To Post
                  </Link>
                </DropdownMenuItem>
                {isOwnTweet ? (
                  <DropdownMenuItem
                    onClick={() =>
                      deleteTweet({
                        isPending: isPendingTweet,
                        startTransition: startTransitionTweet,
                        toast,
                        path: pathname,
                        id: tweet.id
                      })
                    }
                  >
                    <Trash size="20" />
                    Delete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() =>
                      toggleFollowUser({
                        isPending: isPendingFollowUser,
                        startTransition: startTransitionFollowUser,
                        toast,
                        path: pathname,
                        username: tweet.user.username,
                        followed,
                        userId: tweet.user.id,
                        currentUserId: userId
                      })
                    }
                  >
                    {followed ? <UserX2 size="20" /> : <UserPlus2 size="20" />}
                    {followed ? 'Unfollow' : 'Follow'}
                    <span className="max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                      @{tweet.user.username}
                    </span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <div>
            {tweet.imageUrl && (
              <Image
                src={tweet.imageUrl}
                alt="Preview Image"
                width={600}
                height={300}
                loading="lazy"
                className="object-contain rounded-xl"
              />
            )}
          </div>
          <div className="flex items-center gap-x-8">
            <Button
              variant="icon"
              size="icon"
              className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none"
              onClick={replyTweet}
            >
              <MessageCircle size="20px" />
              <span className="text-sm font-extrabold">
                {tweet.replies.length}
              </span>
            </Button>
            <Button
              variant="icon"
              size="icon"
              className={cn(
                'flex items-center gap-x-2 transition',
                liked ? 'text-red-500' : 'text-gray-200 hover:text-red-500'
              )}
              onClick={() =>
                toggleLikeTweet({
                  isPending: isPendingLike,
                  startTransition: startTransitionLike,
                  liked,
                  userId,
                  threadId: tweet.id,
                  path: pathname
                })
              }
              disabled={isPendingLike}
            >
              {liked ? (
                <Image
                  src="/assets/heart-fill-icon.svg"
                  alt="Heart Fill"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              ) : (
                <Heart size="20" />
              )}
              <span className="text-sm font-extrabold">
                {tweet.likes.length}
              </span>
            </Button>
            <div className="flex-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="!outline-none p-2 text-gray-200 transition hover:text-blue">
                  <Share size="20px" />
                </DropdownMenuTrigger>
              </DropdownMenu>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  onClick={() =>
                    copyLinkTweet({
                      toast,
                      username: tweet.user.username,
                      tweetId: tweet.id
                    })
                  }
                >
                  <LinkIcon size="20" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toggleBookmarkTweet({
                      isPending: isPendingBookmark,
                      startTransition: startTransitionBookmark,
                      toast,
                      path: pathname,
                      bookmark,
                      userId,
                      threadId: tweet.id
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
              </DropdownMenuContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweets;
