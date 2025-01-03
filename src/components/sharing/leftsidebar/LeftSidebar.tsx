'use client';

import Lists from './Lists';
import Logout from './Logout';

interface LeftSidebarProps {
  username: string;
  name: string;
  imageUrl: string;
  totalUnreadNotifications: number;
}

const LeftSidebar = ({
  username,
  name,
  imageUrl,
  totalUnreadNotifications
}: LeftSidebarProps) => {
  return (
    <aside className="w-fit max-w-[280px] h-screen p-3 max-sm:hidden sm:flex">
      <section className="overflow-y-auto space-y-20 flex flex-col justify-between">
        <Lists
          username={username}
          totalUnreadNotifications={totalUnreadNotifications}
        />
        <Logout imageUrl={imageUrl} name={name} username={username} />
      </section>
    </aside>
  );
};

export default LeftSidebar;
