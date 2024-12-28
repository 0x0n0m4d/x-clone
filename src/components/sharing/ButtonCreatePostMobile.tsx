'user client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const ButtonCreatePostMobile = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-28 right-6 sh:hidden">
      <Button
        variant="primary"
        className="rounded-full p-2"
        onClick={() => router.push('/compose/tweet')}
      >
        <Image
          src="/assets/create-tweet.svg"
          alt="Create Tweet Icon"
          width={40}
          height={40}
          className="object-contain"
        />
      </Button>
    </div>
  );
};

export default ButtonCreatePostMobile;
