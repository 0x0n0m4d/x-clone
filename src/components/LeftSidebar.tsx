import { Plus } from 'lucide-react';
import { links } from '@/constants';
import LeftSidebarLists from './LeftSidebarLists';
import LeftSidebarLogout from './LeftSidebarLogout';
import { Button } from './ui/button';

interface LeftSidebarProps {
  username: string;
}

const LeftSidebar = ({ username }: LeftSidebarProps) => {
  return (
    <aside className="w-fit h-screen p-3 border-r border-r-gray-300 hidden sm:flex flex-col justify-between">
      <ul className="flex flex-col space-y-6">
        {links.map(link => {
          if (!link.href) link.href = `${username}`;

          return <LeftSidebarLists key={link.title} link={link} />;
        })}
        <Button variant="primary" className="w-fit lg:w-full p-3">
          <span className="hidden lg:inline">Tweet</span>
          <span className="lg:hidden">
            <Plus size={30} />
          </span>
        </Button>
      </ul>
      <LeftSidebarLogout />
    </aside>
  );
};

export default LeftSidebar;
