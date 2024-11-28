'use server';

import { revalidatePath } from 'next/cache';
import {
  GetUsersActionProps,
  SaveUserActionProps,
  ToggleFollowUserActionProps
} from '@/interfaces/user.interface';
import prisma from '@/lib/prismadb';
import { getErrorMessage } from '@/lib/utils';

export async function saveUserAction({
  id,
  imageUrl,
  name,
  username,
  email,
  bio
}: SaveUserActionProps) {
  try {
    if (!id) throw new Error('id required');
    if (!imageUrl) throw new Error('imageUrl required');
    if (!name) throw new Error('name required');
    if (!username) throw new Error('username required');
    if (!email) throw new Error('email required');

    const newUser = await prisma.user.create({
      data: {
        id,
        imageUrl,
        name,
        username,
        email,
        bio,
        isCompleted: true
      }
    });

    return newUser;
  } catch (error: any) {
    console.log('[ERROR_SAVE_USER]', error);
    return {
      message: getErrorMessage(error)
    };
  }
}

export async function getUserAction(id: string) {
  try {
    if (!id) throw new Error('id required');

    const result = await prisma.user.findUnique({
      where: { id },
      include: {
        followers: true,
        followings: true
      }
    });

    if (!result) return;

    return result;
  } catch (error: any) {
    console.log('[ERROR_GET_USER]', error);
    return {
      message: getErrorMessage(error)
    };
  }
}

export async function getUsersAction({
  take = 2,
  skip = 0,
  userId,
  searchQuery = ''
}: GetUsersActionProps) {
  try {
    if (!userId) throw new Error('userId required');

    const result = await prisma.user.findMany({
      where: {
        id: {
          not: userId
        },
        username: {
          contains: searchQuery
        }
      },
      take,
      skip
    });

    return result;
  } catch (error: any) {
    console.log('[ERROR_GET_USERS]', error);
    return {
      message: getErrorMessage(error)
    };
  }
}

export const toggleFollowUserAction = async ({
  id,
  userId,
  currentUserId,
  path
}: ToggleFollowUserActionProps) => {
  try {
    if (id) {
      const result = await prisma.follower.delete({
        where: { id }
      });

      if (!result) return;

      return result;
    }

    if (!userId) throw new Error('userId required');
    if (!currentUserId) throw new Error('currentUserId required');

    const result = await prisma.follower.create({
      data: {
        followerId: userId,
        followingId: currentUserId
      }
    });

    if (!result) return;

    return result;
  } catch (error: any) {
    console.log('[ERROR_TOGGLE_FOLLOWER_USER_ACTION]', error);
    return {
      message: getErrorMessage(error)
    };
  } finally {
    revalidatePath(path || '/home');
  }
};
