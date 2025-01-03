'use client';

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { BookX, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { markAllNotificationsAsReadAction } from '@/actions/notification.action';
import { toastOptions } from '@/lib/utils';
import DeleteModal from '../modals/DeleteModal';
import ButtonBack from '../sharing/ButtonBack';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';

interface Props {
  totalUnreadNotifications: number;
  userId: string;
}

const Topbar = ({ totalUnreadNotifications, userId }: Props) => {
  const path = usePathname();

  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const markAllNotificationsAsRead = () => {
    startTransition(() => {
      markAllNotificationsAsReadAction(userId, path);
      setIsDialogOpen(false);

      toast('Delete Succesfully All bookmarks have been deleted', {
        ...toastOptions,
        duration: 5000
      });
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-10 backdrop-blur bg-black/80">
        <div className="px-3 py-4">
          <div className="flex flex-row items-center gap-x-2">
            <ButtonBack />
            <div className="flex flex-col items-start justify-start">
              <h2 className="font-bold tracking-wide text-xl">Notifications</h2>
              <p className="text-sm font-normal text-gray-200">
                {totalUnreadNotifications} unread notifications
              </p>
            </div>
          </div>
          {Boolean(totalUnreadNotifications) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="!outline-none rounded-full hover:bg-gray-300/30 p-2">
                <MoreHorizontal size={30} />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsDialogOpen(prev => !prev)}
                >
                  <BookX size={16} />
                  Mark All Notifications as Read?
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      <DeleteModal
        title="Mark All Notifications as Read?"
        description="Marking all notifications as read cannot be undone."
        setIsDialogOpen={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
        ButtonAction={
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-600/90 rounded-full font-extrabold text-sm"
            onClick={markAllNotificationsAsRead}
            disabled={isPending}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
};

export default Topbar;
