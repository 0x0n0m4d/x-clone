'use client';

import { MouseEvent, useState, useTransition } from 'react';
import { BookX, MoreHorizontal, Trash } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  deleteNotificationAction,
  markAsReadNotification
} from '@/actions/notification.action';
import DeleteModal from '@/components/modals/DeleteModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Props {
  notificationId: string;
  isRead: boolean;
}

const Menu = ({ notificationId, isRead }: Props) => {
  const path = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const markAsReadHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();

    if (isPending) return;

    startTransition(() => {
      markAsReadNotification(notificationId, path);
    });
  };

  const deleteNotification = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();

    if (isPending) return;

    startTransition(() => {
      deleteNotificationAction(notificationId, path);
    });
  };

  const handlerSetIsDialog = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          {!isRead && (
            <DropdownMenuItem
              onClick={markAsReadHandler}
              className="text-[#f4212e]"
              disabled={isPending}
            >
              <div className="w-7 flex items-center justify-center">
                <BookX className="object-contain w-4 h-4" />
              </div>
              Mark as Read
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handlerSetIsDialog}
            className="text-[#f4212e]"
          >
            <div className="w-7 flex items-center justify-center">
              <Trash size="30" className="object-contain" />
            </div>
            Delete Notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        title="Delete Post?"
        description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results. "
        ButtonAction={
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-600/90 rounded-full font-extrabold text-sm"
            onClick={deleteNotification}
            disabled={isPending}
          >
            Delete
          </Button>
        }
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
};

export default Menu;
