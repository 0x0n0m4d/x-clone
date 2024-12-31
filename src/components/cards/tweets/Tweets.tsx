'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useReplyTweet } from '@/hooks/useReplyTweet';
import { useTweetModal } from '@/hooks/useTweetModal';
import {
  DataTweet,
  MultipleTweetWithConnection
} from '@/interfaces/tweet.interface';
import { renderText } from '@/lib/tweet';
import { customDatePost } from '@/lib/utils';
import { Comment, Like, Menu, Share } from './';

interface Props {
  tweet: MultipleTweetWithConnection;
  userId: string;
}

const Tweets = ({ tweet, userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const setDataTweet = useReplyTweet(state => state.setDataTweet);
  const setOnOpenReplyTweetModal = useTweetModal(state => state.onOpen);

  const liked = tweet.likes.find(like => like.userId === userId);
  const followed = tweet.user.followers.find(
    ({ followingId }) => followingId === userId
  );
  const bookmark = tweet.bookmarks.find(item => item.userId === userId);

  const replyTweet = (isForModal: boolean) => {
    const dataTweet: DataTweet = {
      id: tweet.id,
      text: tweet.text,
      imageUrl: tweet.imageUrl,
      createdAt: tweet.createdAt,
      parentId: tweet.id,
      user: {
        id: tweet.user.id,
        name: tweet.user.name,
        username: tweet.user.username,
        imageUrl: tweet.user.imageUrl
      }
    };

    setDataTweet(dataTweet);

    if (isForModal) {
      setOnOpenReplyTweetModal();
    } else {
      router.push('/compose/tweet');
    }
  };

  const formattedCreatedAt =
    tweet.createdAt && customDatePost(tweet.createdAt.getTime());

  const isOwnTweet = tweet.userId === userId;

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <section className="flex gap-x-5 px-3 py-4 border-b border-b-gray-300 transition">
      <div className="flex items-start jsutify-start rounded-full overflow-hidden">
        <Image
          src={tweet.user.imageUrl}
          alt={tweet.user.name}
          width={35}
          height={35}
          priority
          className="object-cover rounded-full w-[35px] h-[35px]"
        />
      </div>
      <div className="flex-1 flex flex-col space-y-10">
        <section className="flex-1 flex justify-between">
          <div className="flex-1 flex flex-col gap-y-5">
            <div className="flex-1 flex items-center flex-wrap gap-x-2">
              <h5 className="text-ellipsis overflow-hidden whitespace-nowrap font-bold text-white w-fit max-w-[150px]">
                {tweet.user.name}
              </h5>
              <p className="text-ellipsis whitespace-nowrap font-normal text-gray-200">
                @{tweet.user.username} · {formattedCreatedAt}
              </p>
            </div>
            <p className="whitespace-break-spaces">{renderText(tweet.text)}</p>
          </div>
          <div>
            <Menu
              username={tweet.user.username}
              tweetId={tweet.id}
              path={pathname}
              isOwnTweet={isOwnTweet}
              followed={followed!}
              userId={tweet.user.id}
              currentUserId={userId}
            />
          </div>
        </section>
        <section className="flex flex-col space-y-3">
          <section>
            {tweet.imageUrl && (
              <Image
                src={tweet.imageUrl}
                alt="Preview Image"
                width={600}
                height={300}
                loading="lazy"
                className="object-contain rounded-xl"
              />
            )}
          </section>
          <section className="flex items-center gap-x-8">
            <Comment
              totalReplies={tweet.replies.length}
              replyTweet={replyTweet}
            />
            <Like
              liked={liked!}
              path={pathname}
              userId={tweet.user.id}
              currentUserId={userId}
              threadId={tweet.id}
              totalLikes={tweet.likes.length}
            />
            <div className="flex-1 flex justify-end">
              <Share
                path={pathname}
                userId={userId}
                tweetId={tweet.id}
                bookmark={bookmark!}
                username={tweet.user.username}
              />
            </div>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Tweets;
