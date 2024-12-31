'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { User } from '@prisma/client';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { getUsersAction } from '@/actions/user.action';
import { UserWithFollowers } from '@/interfaces/user.interface';
import { cn } from '@/lib/utils';
import Users from '../../cards/Users';
import { Input } from '../../ui/input';
import Focused from './Focused';

interface Props {
  currentUser: UserWithFollowers;
}

const Searchbar = ({ currentUser }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  async function getAllOfUsers(searchQuery: string) {
    const data = await getUsersAction({
      searchQuery,
      userId: currentUser.id,
      isOnSearch: true
    });

    if (!data?.length)
      return toast.error('Something went wrong', { duration: 2000 });

    setUsers(data);
  }

  useEffect(() => {
    getAllOfUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    setTimeout(() => {
      getAllOfUsers(value);
    }, 500);

    return (
      <ul>
        {users.map(user => (
          <Users
            key={user.id}
            username={user.username}
            name={user.name}
            imageUrl={user.imageUrl}
            userId={user.id}
            currentUser={currentUser}
            isOnSearch={true}
            setIsFocused={setIsFocused}
          />
        ))}
      </ul>
    );
  };

  const onBlurSearch = () => {
    setTimeout(() => {
      setIsFocused(false);
      setUsers([]);
      setSearchTerm('');
    }, 100);
  };

  const onFocusSearch = () => {
    setIsFocused(true);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 px-4 py-2.5">
          <Search
            size="20px"
            className={cn('', isFocused ? 'text-blue' : 'text-white')}
          />
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={onChangeSearch}
          placeholder="Search"
          className="no-focus !outline-none border-transparent focus:border-blue ps-12 bg-gray-400 text-white placeholder:text-white/80 rounded-full"
          onFocus={onFocusSearch}
          onBlur={onBlurSearch}
        />
      </div>
      {isFocused && (
        <Focused
          users={users}
          currentUser={currentUser}
          setIsFocused={setIsFocused}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default Searchbar;
