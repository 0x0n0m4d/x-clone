import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export const POST = async (req: Request) => {
  const body = await req.json();
  const { text, imageUrl, userId, path, parentId } = body;

  try {
    if (!text)
      return NextResponse.json({ error: 'text required' }, { status: 400 });
    if (!userId)
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    if (!path)
      return NextResponse.json({ error: 'path required' }, { status: 400 });

    const newPost = await prisma.thread.create({
      data: {
        text,
        imageUrl,
        userId,
        parentId
      }
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.info('[ERROR_API_THREAD_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
