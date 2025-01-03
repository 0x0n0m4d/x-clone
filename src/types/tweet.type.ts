import { Bookmark, Like, Thread } from '@prisma/client';
import { DetailedTweet } from '@/interfaces/tweet.interface';
import { BatchPayload } from '.';

export type WhereFilter = {
  parentId: string | null;
  user: {
    followers: { some: { followingId: string } | undefined };
  };
  bookmarks: { some: { userId: string } } | undefined;
  likes: { some: { userId: string } } | undefined;
  userId: string | undefined;
};

export type GetTweetsActionType =
  | {
      data: DetailedTweet[];
      hasNext: boolean;
    }
  | undefined;

export type CreateTweetActionType = Thread | undefined;

export type GetTweetActionType = DetailedTweet | undefined | null;

export type GetTotalTweetsActionType = number | undefined;

export type DeleteTweetActionType = Thread | undefined;

export type ToggleLikeActionType = Like | undefined;

export type ToggleBookmarkActionType = Bookmark | undefined;

export type GetTotalBookmarkActionType = number | undefined;

export type DeleteBookmarksAction = BatchPayload | undefined;
