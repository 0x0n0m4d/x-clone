'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

const NotFound = () => {
  return (
    <div className="p-3 space-y-32">
      <div>
        <Button
          className="rounded-full hover:bg-gray-300/50 transition"
          variant="icon"
          size="icon"
          onClick={() => (window.location.href = '/home')}
        >
          <ArrowLeft size="16" />
        </Button>
      </div>
      <div className="flex items-center justify-start flex-col space-y-4">
        <p className="text-gray-200 font-normal">
          Hmm... this page doesn't exist. Try searching for something else.
        </p>
        <Button
          variant="primary"
          className="py-0"
          onClick={() => (window.location.href = '/explore')}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
