'user client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useReplyTweet } from '@/hooks/useReplyTweet';
import { DataTweet } from '@/interfaces/tweet.interface';
import { Button } from '../ui/button';

interface Props {
  isMobile?: boolean;
  dataTweet?: DataTweet;
}

const ButtonCreatePostMobile = ({ isMobile, dataTweet }: Props) => {
  const router = useRouter();
  const setDataTweet = useReplyTweet(state => state.setDataTweet);

  const replyTweet = () => {
    if (isMobile && dataTweet) {
      setDataTweet(dataTweet);
      router.push('/compose/tweet');
    }
  };

  return (
    <div className="fixed bottom-28 right-6 sh:hidden">
      <Button
        variant="primary"
        className="rounded-full p-2"
        onClick={replyTweet}
      >
        <Image
          src={`/assets/${isMobile ? 'comment-icon.svg' : 'create-tweet.svg'}`}
          alt="Tweet Icon"
          width={40}
          height={40}
          className="object-contain"
        />
      </Button>
    </div>
  );
};

export default ButtonCreatePostMobile;
