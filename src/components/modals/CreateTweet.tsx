'use client';

import { useTweetModal } from '@/hooks/useTweetModal';
import CreateTweetForm from '../forms/CreateTweetForm';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

const CreateTweet = () => {
  const tweetModal = useTweetModal();

  return (
    <Dialog open={tweetModal.isOpen} onOpenChange={tweetModal.onClose}>
      <DialogContent className="!outline-none !border-none bg-black-100 w-full select-none">
        <DialogHeader>
          <h3 className="tracking-wide text-2xl font-semibold">Create Tweet</h3>
        </DialogHeader>
        <div className="mt-5">
          <CreateTweetForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTweet;