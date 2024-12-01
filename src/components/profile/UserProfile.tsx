'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { CalendarDays, LinkIcon, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserWithFollowers } from '@/interfaces/user.interface';
import { renderText } from '@/lib/tweet';
import { copyLinkUser, toggleFollowUser } from '@/lib/user';
import { cn, months } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

interface Props {
  isMyProfile: boolean;
  user: UserWithFollowers;
  currentUser: {
    id: string;
    username: string;
  };
}

const UserProfile = ({ user, isMyProfile, currentUser }: Props) => {
  const isBannerUrlEmpty = !user.bannerUrl;
  const [isPending, startTransition] = useTransition();
  const path = usePathname();

  const displayBanner = () => {
    if (isBannerUrlEmpty) {
      return (
        <div className="w-full max-sm:h-[135px] sm:h-[230px] bg-gray-300" />
      );
    }

    // @todo: create banner from bannerUrl
  };

  const followed = user.followers.find(
    ({ followingId }) => followingId === currentUser.id
  );

  const isFollowed = () => {
    if (isPending) return '...';
    if (followed) return 'Unfollow';
    return 'Follow';
  };

  const displayHandler = () => {
    if (!isMyProfile) {
      return (
        <div className="flex items-center gap-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="!outline-none p-1.5 border border-gray-200 rounded-full text-white hover:bg-gray-300/30">
              <MoreHorizontal size="20" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                onClick={() =>
                  copyLinkUser({
                    toast,
                    username: user.username
                  })
                }
              >
                <LinkIcon size="20" />
                Copy link to profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            disabled={isPending}
            onClick={() =>
              toggleFollowUser({
                isPending,
                startTransition,
                toast,
                path,
                username: currentUser.username,
                followed,
                userId: user.id,
                currentUserId: currentUser.id
              })
            }
            className={cn(
              'py-2 px-4 font-bold tracking-wide rounded-full text-sm',
              !followed
                ? 'bg-white hover:bg-white/90 text-black-100'
                : 'border border-gray-200 bg-transparent hover:border-red-500 hover:text-red-500 hover:bg-transparent'
            )}
          >
            {isFollowed()}
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-x-4">
        <Button
          variant="primary"
          className="py-2 px-4 font-bold tracking-wide rounded-full bg-transparent hover:bg-gray-300/30 border border-gray-200 text-sm"
        >
          Edit Profile
        </Button>
      </div>
    );
  };

  const displayJoinedDate = () => {
    const month = new Date(user.createdAt).getMonth();
    const year = new Date(user.createdAt).getFullYear();

    return (
      <p className="font-normal text-gray-200 flex items-center gap-x-2">
        <CalendarDays size="18" />
        Joined {months[month]} {year}
      </p>
    );
  };

  const displayFollowersAndFollowings = () => {
    const totalFollowers = user.followers.length;
    const totalFollowings = user.followings.length;

    return (
      <div className="flex items-center gap-x-5">
        <p className="font-normal flex gap-x-2">
          <span className="text-gray-200">Followers</span>
        </p>
        <p className="font-normal flex gap-x-2">
          <span className="text-gray-200">Followings</span>
        </p>
      </div>
    );
  };

  return (
    <div>
      <section>{displayBanner()}</section>
      <section className="px-3 flex flex-col max-sm:-space-y-8 sm:-space-y-12">
        <div className="flex justify-between">
          <Image
            src={user.imageUrl}
            alt={user.name}
            width={133}
            height={133}
            className="object-cover rounded-full max-sm:border-2 sm:border-4 border-black -translate-y-[50%] bg-gray-300 select-none max-sm:w-[90px] sm:w-[133px]"
          />
          <div className="mt-4 h-fit">{displayHandler()}</div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <h2 className="font-bold tracking-wide text-xl">{user.name}</h2>
            <p className="text-sm font-normal text-gray-200">
              @{user.username}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="whitespace-break-spaces text-gray-100">
              {renderText(user.bio || '')}
            </p>
            {displayJoinedDate()}
            {displayFollowersAndFollowings()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
