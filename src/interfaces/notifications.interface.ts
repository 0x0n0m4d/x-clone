interface ParentTypeUserProps {
  userId: string;
  sourceId: string;
  parentIdUser: string;
  path: string;
}

interface ParentTypePostProps {
  userId: string;
  sourceId: string;
  parentIdPost: string;
  path: string;
}

export interface FollowUserNotificationActionProps
  extends ParentTypeUserProps {}
export interface LikePostNotificationProps extends ParentTypePostProps {}
export interface CommentPostNotificationProps extends ParentTypePostProps {}
export interface ReplyCommentPostNotificationActionProps
  extends ParentTypePostProps {}
