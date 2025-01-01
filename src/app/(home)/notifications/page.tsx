import { Fragment } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getNotifications } from '@/actions/notification.action';
import { getUserAction } from '@/actions/user.action';
import PostNotification from '@/components/cards/notifications/PostNotification';
import UserNotification from '@/components/cards/notifications/UserNotification';
import { DataNotification } from '@/interfaces/notifications.interface';

const Page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/');

  const notifications = await getNotifications(user.id);

  const actionTypeField = (data: DataNotification) => {
    if (!data?.activityType) return;

    const options: any = {
      Follow: <UserNotification dataNotification={data} />,
      Like: <PostNotification dataNotification={data} />
    };

    return options[data.parentType];
  };

  return (
    <>
      <section>
        {!notifications?.length
          ? null
          : notifications.map(notification => (
              <Fragment key={notification.id}>
                {actionTypeField(notification)}
              </Fragment>
            ))}
      </section>
    </>
  );
};

export default Page;
