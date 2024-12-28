'use client';

import Lists from './Lists';
import Logout from './Logout';

interface LeftSidebarProps {
  username: string;
  name: string;
  imageUrl: string;
}

const LeftSidebar = ({ username, name, imageUrl }: LeftSidebarProps) => {
  return (
    <aside className="w-fit h-screen p-3 border-r border-r-gray-300 max-sm:hidden sm:flex">
      <section className="overflow-y-auto space-y-20 flex flex-col justify-between">
        <Lists username={username} />
        <Logout imageUrl={imageUrl} name={name} username={username} />
      </section>
    </aside>
  );
};

export default LeftSidebar;
