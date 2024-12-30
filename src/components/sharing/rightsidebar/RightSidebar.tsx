import React from 'react';
import { User } from '@prisma/client';
import { UserWithFollowers } from '@/interfaces/user.interface';
import Searchbar from '../searchbar/Searchbar';
import WhoToFollow from './WhoToFollow';

interface RightSidebarProps {
  users: User[];
  user: UserWithFollowers;
}

const RightSidebar = ({ users, user: currentUser }: RightSidebarProps) => {
  return (
    <aside className="h-screen w-full max-w-[350px] p-3 max-lg:hidden lg:flex flex-col space-y-6">
      <Searchbar currentUser={currentUser} />
      <WhoToFollow users={users} currentUser={currentUser} />
    </aside>
  );
};

export default RightSidebar;
