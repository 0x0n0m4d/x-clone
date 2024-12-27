'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTabsPosts } from '@/hooks/useTabsPosts';
import { UserWithFollowers } from '@/interfaces/user.interface';
import { cn } from '@/lib/utils';
import MobileSidebar from './MobileSidebar';

interface TabsProps {
  title: string;
  isFollowing: boolean;
}
interface TopbarProps {
  isFollowing: boolean;
  user: UserWithFollowers;
}

const Tabs = ({ title, isFollowing }: TabsProps) => {
  const router = useRouter();
  const tabsPosts = useTabsPosts();

  useEffect(() => {
    if (isFollowing) tabsPosts.setStatus('Following');
  }, []);

  const isTitleEqualToStatus = title === tabsPosts.status;

  const handleSearchParams = () => {
    const isStatusFollowing = tabsPosts.status === 'Following';

    if (tabsPosts.status === title) return;

    if (!isStatusFollowing) {
      tabsPosts.setStatus('Following');
      router.push('/home?filter=following');
      return;
    }

    tabsPosts.setStatus('For You');
    router.push('/home');
  };

  return (
    <div
      className="flex-1 flex justify-center cursor-pointer hover:bg-gray-300 transition"
      onClick={handleSearchParams}
    >
      <p
        className={cn(
          'py-3.5',
          isTitleEqualToStatus
            ? 'border-b-[3px] border-b-blue font-bold text-white'
            : 'text-gray-200 font-normal'
        )}
      >
        {title}
      </p>
    </div>
  );
};

const Topbar = ({ isFollowing, user }: TopbarProps) => {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/80 border-b border-gray-300">
      <div className="px-3 py-4">
        <div className="max-sm:flex sm:hidden flex-row justify-start relative">
          <div className="relative z-10">
            <MobileSidebar user={user} />
          </div>
          <div className="absolute left-0 top-0 rigth-0 z-0 flex justify-center">
            <Image
              src="/assets/small-x-logo.svg"
              alt="X Logo"
              width={30}
              height={30}
              className="object-contain w-[30px] h-[30px]"
            />
          </div>
        </div>
        <h2 className="font-bold tracking-wide text-xl max-sm:hidden sm:block">
          Home
        </h2>
      </div>
      <div className="flex justify-evenly">
        <Tabs title="For You" isFollowing={isFollowing} />
        <Tabs title="Following" isFollowing={isFollowing} />
      </div>
    </nav>
  );
};

export default Topbar;
