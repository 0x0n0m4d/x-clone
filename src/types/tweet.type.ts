import { DetailedTweet } from '@/interfaces/tweet.interface';

export type GetTweetsActionType = {
  data: DetailedTweet[];
  hasNext: boolean;
};

export type WhereFilter = {
  parentId: string | null;
  user: {
    followers: { some: { followingId: string } | undefined };
  };
  bookmarks: { some: { userId: string } } | undefined;
  likes: { some: { userId: string } } | undefined;
  userId: string | undefined;
};
