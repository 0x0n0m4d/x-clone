import { Fragment } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getNotificationsAction } from '@/actions/notification.action';
import { getUserAction } from '@/actions/user.action';
import PostNotification from '@/components/cards/notifications/PostNotification';
import UserNotification from '@/components/cards/notifications/UserNotification';
import NotFound from '@/components/sharing/NotFound';
import PaginationButtons from '@/components/sharing/PaginationButtons';
import { DataNotification } from '@/interfaces/notifications.interface';
import { isValidPage } from '@/lib/utils';

interface Props {
  searchParams: {
    page: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  const { page: qPage } = searchParams;
  const page = isValidPage(qPage);

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/');

  const notifications = await getNotificationsAction({ userId: user.id, page });

  const actionTypeField = (data: DataNotification): JSX.Element | null => {
    if (!data?.activityType) return null;

    const options: any = {
      User: <UserNotification dataNotification={data} />,
      Post: (
        <PostNotification
          currentUsername={user.username}
          dataNotification={data}
        />
      )
    };

    return options[data.parentType];
  };

  return notifications?.data.length ? (
    <>
      {notifications.data.map(notification => (
        <Fragment key={notification.id}>
          {actionTypeField(notification)}
        </Fragment>
      ))}
      <PaginationButtons
        currentPage={page}
        currentPath="/notifications"
        hasNext={notifications.hasNext}
      />
    </>
  ) : (
    <NotFound
      title="Nothing to see here — yet"
      description="All notifications will be here, starting from likes, comments, replies and others"
    />
  );
};

export default Page;
