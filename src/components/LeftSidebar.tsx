'use client';

import { SignedIn, SignOutButton } from '@clerk/nextjs';
import { LogOut, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { links } from '@/constants';
import { useTweetModal } from '@/hooks/useTweetModal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface LeftSidebarProps {
  username: string;
  name: string;
  imageUrl: string;
}

const LeftSidebar = ({ username, name, imageUrl }: LeftSidebarProps) => {
  const pathname = usePathname();
  const openTweetModal = useTweetModal(state => state.onOpen);
  return (
    <aside className="w-fit h-screen p-3 border-r border-r-gray-300 max-sm:hidden sm:flex flex-col justify-between">
      <ul className="flex flex-col space-y-6">
        {links.map(link => {
          if (!link.href) link.href = `/${username}`;

          const isNotLogo = link.title !== 'X Logo';
          const isSamePath = isNotLogo && link.href === pathname;

          return (
            <li
              key={link.title}
              className={cn(
                'w-fit max-lg:p-3 lg:py-3 lg:px-5 rounded-full hover:bg-black-200 transition',
                isSamePath && 'bg-black-200 font-bold'
              )}
            >
              <Link
                href={link.href}
                className="flex flex-row items-center gap-x-6 tracking-wider text-xl"
              >
                <Image
                  src={link.icon}
                  alt={link.title}
                  width={30}
                  height={30}
                  className="object-contain"
                />
                {isNotLogo && (
                  <span className="max-lg:hidden lg:inline">{link.title}</span>
                )}
              </Link>
            </li>
          );
        })}
        <Button
          variant="primary"
          className="max-lg:w-fit lg:w-full p-3"
          onClick={openTweetModal}
        >
          <span className="max-lg:hidden lg:inline">Tweet</span>
          <span className="max-lg:inline lg:hidden">
            <Plus size={30} />
          </span>
        </Button>
      </ul>
      <SignedIn>
        <SignOutButton>
          <div className="max-lg:p-3 lg:py-2 lg:px-5 rounded-full hover:bg-black-200 transition flex items-center gap-x-20 cursor-pointer">
            <div className="max-lg:hidden lg:flex items-center gap-x-6">
              <Image
                src={imageUrl}
                alt={name}
                width={50}
                height={50}
                priority
                className="object-contain rounded-full"
              />
              <div className="flex flex-col items-start">
                <h5 className="font-bold text-white tracking-wide whitespace-nowrap">
                  {name.length > 10 ? `${name.slice(0, 10)}...` : name}
                </h5>
                <span className="text-gray-200 font-bold whitespace-nowrap">
                  @
                  {username.length > 8
                    ? `${username.slice(0, 8)}...`
                    : username}
                </span>
              </div>
            </div>
            <LogOut size={30} />
          </div>
        </SignOutButton>
      </SignedIn>
    </aside>
  );
};

export default LeftSidebar;
