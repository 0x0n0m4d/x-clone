'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toggleFollowUserAction } from '@/actions/follower.action';
import { UserWithFollowers } from '@/interfaces/user.interface';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface UsersProps {
  username: string;
  name: string;
  imageUrl: string;
  userId: string;
  currentUser: UserWithFollowers;
  isOnSearch?: boolean;
}

const Users = ({
  username,
  name,
  imageUrl,
  userId,
  currentUser,
  isOnSearch
}: UsersProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const followed = currentUser.followings.find(
    ({ followingId }) => followingId === currentUser.id
  );

  const toggleFollowUser = () => {
    if (isPending) return;
    startTransition(() => {
      if (followed) {
        toggleFollowUserAction({ id: followed.id });
      } else {
        toggleFollowUserAction({ userId, currentUserId: currentUser.id });
      }
    });

    router.refresh();
  };

  const isFollowed = () => {
    if (isPending) return '...';
    if (followed) return 'Unfollow';
    return 'Follow';
  };

  const shortenedName = name.length > 10 ? `${name.slice(0, 10)}...` : name;
  const shortenedUsername =
    username.length > 8 ? `${username.slice(0, 8)}...` : username;

  return (
    <li className="flex items-center justify-between gap-x-8 w-full hover:bg-gray-300/90 rounded-xl p-3 cursor-pointer overflow-hidden">
      <div className="flex items-center gap-x-2">
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className="object-cover rounded-full"
        />
        <div className="flex items-start flex-col -space-y-1">
          <h5 className="font-normal text-white whitespace-nowrap">
            {isOnSearch ? name : shortenedName}
          </h5>
          <span className="font-Normal text-gray-200 whitespace-nowrap">
            @{isOnSearch ? username : shortenedUsername}
          </span>
        </div>
      </div>
      {!isOnSearch && (
        <div>
          <Button
            disabled={isPending}
            onClick={toggleFollowUser}
            className={cn(
              'py-1 px-4 font-bold tracking-wide rounded-full',
              !followed
                ? 'bg-white hover:bg-white/90 text-black-100'
                : 'border border-white bg-transparent hove:border-red-500 hover:text-red-500 hover:bg-transparent'
            )}
          >
            {isFollowed()}
          </Button>
        </div>
      )}
    </li>
  );
};

export default Users;
