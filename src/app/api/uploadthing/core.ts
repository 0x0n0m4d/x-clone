import { currentUser } from '@clerk/nextjs/server';
import { createUploadthing } from 'uploadthing/next';
import type { FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageProfile: f({
    image: { maxFileSize: '1MB' }
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) throw new Error('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      console.info('file url:', file.url);
    }),
  imageThreaad: f({
    image: { maxFileSize: '4MB' }
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) throw new Error('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      console.info('file url:', file.url);
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
