import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { linksMobile } from '@/constants';
import { cn } from '@/lib/utils';

interface Props {
  username: string;
}

const Bottombar = ({ username }: Props) => {
  const pathname = usePathname();
  return (
    <div className="max-sm:flex sm:hidden fixed bottom-0 px-6 pb-10 pt-4 left-0 right-0 border-t border-t-gray-300 backdrop-blur bg-black/80">
      <ul className="flex items-center justify-evenly w-full">
        {linksMobile.map(link => {
          if (!link.href) link.href = `/${username}`;
          const isSamePath = link.href === pathname;
          const isOnStatusPost =
            link.href === '/home' && pathname.includes('status');
          return (
            <li key={link.title}>
              <Link
                href={link.href}
                className="flex flex-col items-center space-y-2"
              >
                <Image
                  src={link.icon}
                  alt={link.title}
                  width={25}
                  height={25}
                  className={cn(
                    'object-contain transition-all',
                    isSamePath || isOnStatusPost
                      ? 'w-[28px] h-[28px]'
                      : 'w-[25px] h-[25px]'
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bottombar;