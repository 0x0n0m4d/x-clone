import { ReactNode } from 'react';
import Topbar from '@/components/notifications/Topbar';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Topbar />
      {children}
    </>
  );
};

export default Layout;
