'use client';

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { Follower } from '@prisma/client';
import {
  ArrowUpRight,
  MoreHorizontal,
  Trash,
  UserPlus2,
  UserX2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/components/modals/DeleteModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteTweet } from '@/lib/tweet';
import { toggleFollowUser } from '@/lib/user';

interface Props {
  username: string;
  tweetId: string;
  isOwnTweet: boolean;
  path: string;
  followed: Follower;
  userId: string;
  currentUserId: string;
}

const Menu = ({
  username,
  tweetId,
  isOwnTweet,
  path,
  userId,
  currentUserId,
  followed
}: Props) => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPendingTweet, startTransitionTweet] = useTransition();
  const [isPendingFollowUser, startTransitionFollowUser] = useTransition();

  const deleteTweetHandler = () => {
    deleteTweet({
      isPending: isPendingTweet,
      startTransition: startTransitionTweet,
      toast,
      path,
      id: tweetId
    });

    setIsDialogOpen(false);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/${username}/status/${tweetId}`)}
          >
            <ArrowUpRight size="30px" />
            Go To Post
          </DropdownMenuItem>
          {isOwnTweet ? (
            <DropdownMenuItem
              onClick={() => setIsDialogOpen(true)}
              className="text-[#f4212e]"
            >
              <Trash size="20px" />
              Delete
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() =>
                toggleFollowUser({
                  isPending: isPendingFollowUser,
                  startTransition: startTransitionFollowUser,
                  toast,
                  path,
                  username,
                  followed,
                  userId,
                  currentUserId
                })
              }
            >
              {followed ? <UserX2 size="20" /> : <UserPlus2 size="20" />}
              {followed ? 'Unfollow' : 'Follow'}
              <span className="max-w-[80px] overflow-hidden whitespace-nowrap text-ellipsis">
                @{username}
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        title="Delete post?"
        description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
        ButtonAction={
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-600/90 rounded-full font-extrabold text-sm"
            onClick={deleteTweetHandler}
            disabled={isPendingTweet}
          >
            Delete
          </Button>
        }
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
};

export default Menu;
