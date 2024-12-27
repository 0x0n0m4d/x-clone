'use client';

import { UserWithFollowers } from '@/interfaces/user.interface';
import Searchbar from '../searchbar/Searchbar';

interface Props {
  user: UserWithFollowers;
}

const Topbar = ({ user }: Props) => {
  return (
    <nav className="sticky top-0 z-10 backdrop-bluc bg-black/80 py-4 px-3">
      <Searchbar currentUser={user} />
    </nav>
  );
};

export default Topbar;
