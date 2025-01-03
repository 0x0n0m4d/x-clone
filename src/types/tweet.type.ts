import { DetailedTweet } from '@/interfaces/tweet.interface';

export type GetTweetsActionType = {
  data: DetailedTweet[];
  hasNext: boolean;
};
