'use client';

import { useEffect, useState, useTransition } from 'react';
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
import { useRouter } from 'next/navigation';
import { toggleFollowUserAction } from '@/actions/follower.action';
import {
  deleteTweetAction,
  toggleBookmarkTweet,
  toggleLikeTweet
} from '@/actions/tweet.action';
import { useTweetModal } from '@/hooks/useTweetModal';
import { DataTweet, TweetWithConnection } from '@/interfaces/tweet.interface';
import { cn, customDatePost } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useToast } from '../ui/use-toast';

interface Props {
  tweet: TweetWithConnection;
  userId: string;
}

const Tweets = ({ tweet, userId }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const tweetModal = useTweetModal();

  const [isPendingLike, startTransitionLike] = useTransition();
  const [isPendingFollowUser, startTransitionFollowUser] = useTransition();
  const [isPendingBookmark, startTransitionBookmark] = useTransition();
  const [isPendingTweet, startTransitionTweet] = useTransition();

  const liked = tweet.likes.find(like => like.userId === userId);
  const toggleLikeAction = () => {
    if (isPendingLike) return;

    startTransitionLike(async () => {
      if (liked) {
        const result = await toggleLikeTweet({
          likeId: liked.id
        });

        if (!result) {
          toast({
            title: 'Something went wrong, please try again.',
            duration: 2000,
            variant: 'destructive'
          });
          return;
        }
      } else {
        const result = await toggleLikeTweet({
          userId,
          threadId: tweet.id
        });

        if (!result) {
          toast({
            title: 'Something went wrong, please try again.',
            duration: 2000,
            variant: 'destructive'
          });
          return;
        }
      }
    });
    router.refresh();
  };

  const followed = tweet.user.followers.find(
    ({ followingId }) => followingId === userId
  );
  const toggleFollowUser = (username: string) => {
    if (isPendingFollowUser) return;

    startTransitionFollowUser(async () => {
      if (followed) {
        const result = await toggleFollowUserAction({ id: followed.id });

        if (!result) {
          toast({
            title: 'Something went wrong, please try again.',
            duration: 2000,
            variant: 'destructive'
          });
          return;
        }

        toast({
          title: `You unfollowed ${username}`,
          duration: 2000,
          variant: 'primary'
        });
      } else {
        const result = toggleFollowUserAction({
          userId: tweet.user.id,
          currentUserId: userId
        });

        if (!result) {
          toast({
            title: 'Something went wrong, please try again.',
            duration: 2000,
            variant: 'destructive'
          });
          return;
        }

        toast({
          title: `You followed ${username}`,
          duration: 2000,
          variant: 'primary'
        });
      }
    });

    router.refresh();
  };

  const bookmark = tweet.bookmarks.find(item => item.userId === userId);
  const toggleBookmarkAction = () => {
    if (isPendingBookmark) return;

    startTransitionBookmark(async () => {
      if (bookmark) {
        const result = await toggleBookmarkTweet({
          bookmarkId: bookmark.id
        });

        if (!result) {
          toast({
            title: 'Something went wrong, please try again.',
            duration: 2000,
            variant: 'destructive'
          });
          return;
        }

        toast({
          title: 'Removed from your Bookmarks',
          duration: 2000,
          variant: 'primary'
        });
      } else {
        const result = await toggleBookmarkTweet({
          userId,
          threadId: tweet.id
        });

        if (!result) {
          toast({
            title: 'Something went wrong, please try again.',
            duration: 2000,
            variant: 'destructive'
          });
          return;
        }

        toast({
          title: 'Added to your Bookmarks',
          duration: 2000,
          variant: 'primary'
        });
      }
    });

    router.refresh();
  };

  const deleteTweet = () => {
    if (isPendingTweet) return;

    startTransitionTweet(async () => {
      const result = await deleteTweetAction(tweet.id);

      if (!result) {
        toast({
          title: 'Something went wrong, please try again.',
          duration: 2000,
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Your post was deleted',
        duration: 2000,
        variant: 'primary'
      });
    });

    router.refresh();
  };

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

  const renderText = () => {
    const textWithoutEmptyLines = tweet.text.replace(/^\s*$/gm, '');
    const textWithSingleLineBreaks = textWithoutEmptyLines.replace(
      /\n+/g,
      '\n\n'
    );
    return textWithSingleLineBreaks;
  };

  const formattedCreatedAt =
    tweet.createdAt && customDatePost(tweet.createdAt.getTime());

  const copyLink = () => {
    const url = process.env.NEXT_PUBLIC_NEXT_URL;
    const username = tweet.user.username;
    const tweetId = tweet.id;

    navigator.clipboard.writeText(`${url}/${username}/status/${tweetId}`);

    toast({
      title: 'Copied to clipboard',
      duration: 2000,
      variant: 'primary'
    });
  };

  const isOwnTweet = tweet.userId === userId;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        'flex gap-x-5 px-3 py-4 border-b border-b-gray-300 transition'
      )}
    >
      <div className="flex items-start justify-start rounded-full overflow-hidden">
        <Image
          src={tweet.user.imageUrl}
          alt={tweet.user.name}
          width={35}
          height={35}
          priority
          className="object-cover rounded-full"
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
            <p className="whitespace-break-spaces">{renderText()}</p>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full">
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/${tweet.user.username}/status/${tweet.id}`)
                  }
                >
                  <ArrowUpRight size="20" />
                  Go To Post
                </DropdownMenuItem>
                {isOwnTweet ? (
                  <DropdownMenuItem onClick={deleteTweet}>
                    <Trash size="20" />
                    Delete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => toggleFollowUser(tweet.user.username)}
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
            <Button>
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
                <DropdownMenuItem onClick={copyLink}>
                  <LinkIcon size="20" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>
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
