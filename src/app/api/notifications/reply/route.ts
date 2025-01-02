import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export const POST = async (req: Request) => {
  const body = await req.json();
  const { userId, sourceId, parentIdPost } = body;

  try {
    if (!userId) return NextResponse.json('userId required', { status: 400 });
    if (!sourceId)
      return NextResponse.json('sourceId required', { status: 400 });
    if (!parentIdPost)
      return NextResponse.json('parentIdPost required', { status: 400 });

    await prisma.notification.create({
      data: {
        userId,
        sourceId,
        parentIdPost,
        parentType: 'Post',
        activityType: 'Reply'
      }
    });

    NextResponse.json({ message: 'Success' }, { status: 201 });
  } catch (error) {
    console.info('[ERROR_API_NOTIFICATION_REPLY_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
