'use client';

import { Fragment, useEffect, useState, useTransition } from 'react';
import { useInView } from 'react-intersection-observer';
import { getNotifications } from '@/actions/notification.action';
import { DataNotification } from '@/interfaces/notifications.interface';
import PostNotification from '../cards/notifications/PostNotification';
import UserNotification from '../cards/notifications/UserNotification';
import Loading from '../sharing/Loading';

interface Props {
  initialDataNotifications: DataNotification[];
  userId: string;
  currentUsername: string;
}

const ShowNotificationsData = ({
  initialDataNotifications,
  userId,
  currentUsername
}: Props) => {
  const [dataNotifications, setDataNotifications] = useState(
    initialDataNotifications
  );
  const [isNotificationDataMaxed, setIsNotificationDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [_, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);
  const [ref, inView] = useInView();

  const loadMoreDataNotifications = async () => {
    try {
      if (currentPage === 0) {
        return startTransition(() => {
          setCurrentPage((prev: number) => prev + 1);
        });
      }

      setIsPending(true);

      const newDataNotifications = await getNotifications({
        userId,
        page: currentPage
      });

      startTransition(() => {
        if (!newDataNotifications?.length) {
          setIsNotificationDataMaxed(true);
          return;
        }

        setDataNotifications((prev: DataNotification[] | null) => [
          ...(prev?.length ? prev : []),
          ...newDataNotifications
        ]);
        setCurrentPage(prev => prev + 1);
      });
    } catch (error) {
      console.info('[ERROR_LOAD_MORE_DATA_NOTIFICATIONS]', error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    setDataNotifications(initialDataNotifications);
    setIsNotificationDataMaxed(false);
    setCurrentPage(1);
  }, [initialDataNotifications]);

  useEffect(() => {
    if (isPending) return;

    if (inView) {
      loadMoreDataNotifications();
    }
  }, [inView]);

  const actionTypeField = (data: DataNotification) => {
    if (!data?.activityType) return;

    const options: any = {
      User: <UserNotification dataNotification={data} />,
      Post: (
        <PostNotification
          dataNotification={data}
          currentUsername={currentUsername}
        />
      )
    };

    return options[data.parentType];
  };

  if (!dataNotifications?.length) {
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
    dataNotifications?.length && (
      <>
        <section className="flex flex-col">
          {!dataNotifications?.length
            ? null
            : dataNotifications.map(notification => (
                <Fragment key={notification.id}>
                  {actionTypeField(notification)}
                </Fragment>
              ))}
        </section>
        {!isNotificationDataMaxed && (
          <section ref={ref}>
            <Loading />
          </section>
        )}
      </>
    )
  );
};

export default ShowNotificationsData;
