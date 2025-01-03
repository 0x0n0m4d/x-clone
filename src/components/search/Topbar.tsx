'use client';

import { UserWithFollowers } from '@/interfaces/user.interface';
import ButtonBack from '../sharing/ButtonBack';
import Searchbar from '../sharing/searchbar/Searchbar';

interface Props {
  user: UserWithFollowers;
}

const Topbar = ({ user }: Props) => {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/80 py-4 px-3 flex justify-between items-center gap-x-3">
      <ButtonBack />
      <Searchbar currentUser={user} />
    </nav>
  );
};

export default Topbar;
