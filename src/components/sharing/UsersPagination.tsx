'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface Props {
  totalPage: number;
  currentPage: number;
}

const UsersPagination = ({ totalPage, currentPage }: Props) => {
  const router = useRouter();

  return (
    <section>
      <Button
        disabled={currentPage === 0}
        variant="icon"
        size="icon"
        onClick={() => router.push(`/explore?page=${currentPage - 1}`)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        disabled={totalPage === currentPage}
        variant="icon"
        size="icon"
        onClick={() => router.push(`/explore?page=${currentPage + 1}`)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </section>
  );
};

export default UsersPagination;