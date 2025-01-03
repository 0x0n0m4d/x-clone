import { ReactNode, Suspense } from 'react';
import Loading from '@/components/sharing/Loading';

interface Props {
  children: ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
};

export default layout;
