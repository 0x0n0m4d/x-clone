'use client';

import { ChangeEvent, useState } from 'react';
import { User } from '@prisma/client';
import { Search } from 'lucide-react';
import { getUsers } from '@/actions/user.action';
import { UserWithFollowers } from '@/interfaces/user.interface';
import { cn } from '@/lib/utils';
import Users from './cards/Users';
import { Input } from './ui/input';

interface Props {
  currentUser: UserWithFollowers;
}

const Searchbar = ({ currentUser }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  async function getAllOfUsers(searchQuery: string) {
    const result = await getUsers({
      searchQuery,
      userId: currentUser.id
    });

    setUsers(result ?? []);
  }

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    setTimeout(() => {
      getAllOfUsers(value);
    }, 500);
  };

  const isUsersEmpty = !users.length;

  const renderSearchResults = () => {
    if (isUsersEmpty) {
      return (
        <p className="font-normal text-gray-200 tracking-wide">
          {searchTerm} not found
        </p>
      );
    }

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
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="relative">
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setUsers([]);
            setSearchTerm('');
          }}
        />
      </div>
      {isFocused && (
        <div
          className={cn(
            'absolute max-h-[600px] overflow-y-auto top-14 left-0 right-0 bg-black-100 shadow-[0_0_10px_1px_rgba(255,255,255,0.3)] p-3 text-center rounded-xl',
            isUsersEmpty && 'pb-16'
          )}
        >
          {!searchTerm ? (
            <p className="font-normal text-gray-200 tracking-wide">
              Try searching for people
            </p>
          ) : (
            renderSearchResults()
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;