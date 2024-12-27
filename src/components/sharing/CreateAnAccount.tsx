'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const CreateAnAccount = () => {
  const router = useRouter();
  return (
    <Button
      variant="primary"
      onClick={() => {
        router.push('/sign-in');
      }}
    >
      Create An Account
    </Button>
  );
};

export default CreateAnAccount;
