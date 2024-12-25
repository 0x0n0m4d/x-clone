'use client';

import { Dispatch, SetStateAction, useTransition } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserWithFollowers } from '@/interfaces/user.interface';
import { toggleFollowUser } from '@/lib/user';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface UsersProps {
  username: string;
  name: string;
  imageUrl: string;
  userId: string;
  currentUser: UserWithFollowers;
  isOnSearch?: boolean;
  setIsFocused?: Dispatch<SetStateAction<boolean>>;
}

const Users = ({
  username,
  name,
  imageUrl,
  userId,
  currentUser,
  isOnSearch,
  setIsFocused
}: UsersProps) => {
  const path = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const followed = currentUser.followings.find(
    ({ followingId }) => followingId === currentUser.id
  );

  const isFollowed = () => {
    if (isPending) return '...';
    if (followed) return 'Unfollow';
    return 'Follow';
  };

  const redirectToProfilePage = () => {
    if (!isOnSearch || !setIsFocused) return;

    router.push(`/${username}`);
    setIsFocused(false);
  };

  return (
    <li
      className={cn(
        'flex items-center justify-between gap-x-8 w-full hover:bg-gray-300/90 rounded-xl p-3 overflow-hidden',
        isOnSearch && 'cursor-pointer'
      )}
      onClick={redirectToProfilePage}
    >
      <div className="flex items-center gap-x-2 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          width={40}
          height={40}
          className="object-cover rounded-full w-[40px] h-[40px]"
        />
        <div className="flex items-start flex-col -space-y-1">
          <Link
            href={`/${username}`}
            className={cn(
              'font-normal text-white whitespace-nowrap hover:underline'
            )}
          >
            {name}
          </Link>
          <p className="font-normal text-gray-200 whitespace-nowrap">
            @{username}
          </p>
          {followed && (
            <p className="font-normal text-gray-200 flex items-centr gap-x-1">
              <User size={14} />
              Following
            </p>
          )}
        </div>
      </div>
      {!isOnSearch && (
        <div>
          <Button
            disabled={isPending}
            onClick={() =>
              toggleFollowUser({
                isPending,
                startTransition,
                toast,
                path,
                username,
                followed,
                userId,
                currentUserId: currentUser.id
              })
            }
            className={cn(
              'py-1 px-4 font-bold tracking-wide rounded-full',
              !followed
                ? 'bg-white hover:bg-white/90 text-black-100'
                : 'border border-gray-200 bg-transparent hove:border-red-500 hover:text-red-500 hover:bg-transparent'
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
