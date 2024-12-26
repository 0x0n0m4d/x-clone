'use server';

import { revalidatePath } from 'next/cache';
import {
  GetUsersActionProps,
  SaveUserActionProps,
  ToggleFollowUserActionProps,
  UpdateUserActionProps
} from '@/interfaces/user.interface';
import prisma from '@/lib/prismadb';
import { getErrorMessage } from '@/lib/utils';

export async function saveUserAction({
  id,
  imageUrl,
  name,
  username,
  email,
  bio,
  isCompleted
}: SaveUserActionProps) {
  try {
    if (!id) throw new Error('id required');
    if (!imageUrl) throw new Error('imageUrl required');
    if (!name) throw new Error('name required');
    if (!username) throw new Error('username required');
    if (!email) throw new Error('email required');
    if (!isCompleted) throw new Error('isCompleted required');

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    if (existingUser) {
      const updateUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          imageUrl,
          bio,
          isCompleted
        }
      });
      return updateUser;
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        imageUrl,
        name,
        username,
        email,
        bio,
        isCompleted
      }
    });

    return newUser;
  } catch (error: any) {
    console.log('[ERROR_SAVE_USER_ACTION]', error);
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
  take = 10,
  skip = 0,
  userId,
  searchQuery = '',
  isOnSearch
}: GetUsersActionProps) {
  try {
    if (!userId) throw new Error('userId required');

    if (isOnSearch) {
      const users = await prisma.user.findMany({
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

      return users;
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId
        },
        username: {
          contains: searchQuery
        },
        followers: {
          none: {
            NOT: {
              followerId: userId
            }
          }
        }
      },
      take,
      skip
    });

    return users;
  } catch (error: any) {
    console.log('[ERROR_GET_USERS_ACTION]', error);
    return {
      message: getErrorMessage(error)
    };
  }
}

export async function updateUserAction({
  id,
  imageUrl,
  bannerUrl,
  name,
  bio,
  location,
  website,
  path
}: UpdateUserActionProps) {
  try {
    if (!id) throw new Error('id required');
    if (!imageUrl) throw new Error('imageUrl required');
    if (!name) throw new Error('name required');

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        imageUrl,
        name,
        bannerUrl,
        bio,
        location,
        website
      }
    });

    return updateUser;
  } catch (error) {
    console.log('[ERROR_UPDATE_USER_ACTION]', error);
    return {
      message: getErrorMessage(error)
    };
  } finally {
    revalidatePath(path || '');
  }
}

export async function getUserByUsernameAction(username: string) {
  try {
    if (!username) throw new Error('username required');

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        followers: true,
        followings: true
      }
    });

    return user;
  } catch (error: any) {
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
