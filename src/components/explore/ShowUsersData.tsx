'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { User } from '@prisma/client';
import { getUsersAction } from '@/actions/user.action';
import { UserWithFollowers } from '@/interfaces/user.interface';
import Users from '../cards/Users';
import Loading from '../sharing/Loading';

interface Props {
  initialDataUsers: User[] | null;
  user: UserWithFollowers;
}

const ShowUserData = ({ initialDataUsers: users, user }: Props) => {
  const [dataUsers, setDataUsers] = useState(users);
  const [isUsersDataMaxed, setIsUsersDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionLoadingRef, inView] = useInView();

  const loadMoreDataUsers = async () => {
    const newDataUsers = await getUsersAction({
      userId: user.id,
      size: 20,
      page: currentPage
    });

    if (!newDataUsers?.length) {
      setIsUsersDataMaxed(true);
      return;
    }

    setDataUsers((prev: User[] | null) => [
      ...(prev?.length ? prev : []),
      ...newDataUsers
    ]);
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (inView) {
      loadMoreDataUsers();
    }
  }, [inView]);

  if (!dataUsers?.length) {
    return (
      <div className="flex justify-center py-4 px-3">
        <div className="flex flex-col items-start">
          <p className="font-normal text-gray-200">
            Try searching for something else
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col py-4 px-3">
        {dataUsers.map(userData => (
          <Users
            key={userData.id}
            name={userData.name}
            username={userData.username}
            imageUrl={userData.imageUrl}
            userId={userData.id}
            currentUser={user}
          />
        ))}
      </ul>
      {!isUsersDataMaxed && (
        <section ref={sectionLoadingRef}>
          <Loading />
        </section>
      )}
    </>
  );
};

export default ShowUserData;
