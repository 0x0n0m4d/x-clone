'use server';

import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import {
  GetUsersActionProps,
  SaveUserActionProps,
  ToggleFollowUserActionProps,
  UpdateUserActionProps
} from '@/interfaces/user.interface';
import prisma from '@/lib/prismadb';

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
  }
}

export async function getUsersAction({
  size = 5,
  page = 0,
  userId,
  searchQuery = '',
  isOnSearch
}: GetUsersActionProps) {
  try {
    if (!userId) throw new Error('userId required');

    if (isOnSearch) {
      if (!searchQuery) return [];
      const users = await prisma.user.findMany({
        where: {
          id: {
            not: userId
          },
          OR: [
            {
              username: {
                contains: searchQuery
              }
            },
            {
              name: {
                contains: searchQuery
              }
            }
          ]
        },
        take: size
      });

      return users;
    }

    const skip = size * page;
    let dataUsers: User[];

    if (skip) {
      dataUsers = await prisma.user.findMany({
        where: {
          id: {
            not: userId
          },
          followers: {
            none: {
              NOT: {
                followerId: userId
              }
            }
          }
        },
        skip,
        take: size
      });
    } else {
      dataUsers = await prisma.user.findMany({
        where: {
          id: {
            not: userId
          },
          followers: {
            none: {
              NOT: {
                followerId: userId
              }
            }
          }
        },
        take: size
      });
    }

    return dataUsers;
  } catch (error: any) {
    console.log('[ERROR_GET_USERS_ACTION]', error);
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
    console.info('[ERROR_GET_USER_BY_USERNAME_ACTION]', error);
  }
}

export const toggleFollowUserAction = async ({
  userId,
  currentUserId,
  path
}: ToggleFollowUserActionProps) => {
  try {
    if (userId && !currentUserId) {
      const existingUser = await prisma.follower.findFirst({
        where: {
          followerId: userId
        }
      });

      if (!existingUser) return;

      return await prisma.follower.delete({
        where: {
          id: existingUser.id
        }
      });
    }

    if (!userId) throw new Error('userId requided');
    if (!currentUserId) throw new Error('currentUserId requided');

    const existingUser = await prisma.follower.findFirst({
      where: {
        followerId: userId,
        followingId: currentUserId
      }
    });

    if (existingUser) return;

    return await prisma.follower.create({
      data: {
        followerId: userId,
        followingId: currentUserId
      }
    });
  } catch (error: any) {
    console.log('[ERROR_TOGGLE_FOLLOWER_USER_ACTION]', error);
  } finally {
    revalidatePath(path);
  }
};

// create fake user data
export const createManyUser = async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '3fb1263a-f92e-4a04-a678-cb5f7acfc0b5',
        name: 'Gustavo Bughi',
        username: 'bughi',
        email: 'bughi@example.com',
        imageUrl: 'bughi.jpg',
        bannerUrl: 'banner_bughi.jpg',
        location: 'New York',
        website: 'www.bughi.com',
        bio: "Hello, I'm Gustavo Bughi."
      },
      {
        id: 'd5e04c90-8d14-43a9-850d-0a4ebe9e24dd',
        name: 'Johnatan Moura',
        username: 'johny',
        email: 'johny@example.com',
        imageUrl: 'johny.jpg',
        bannerUrl: 'banner_johny.jpg',
        location: 'Los Angeles',
        website: 'www.johny.com',
        bio: "Hi there, I'm Johny."
      },
      {
        id: '14b2a6a6-22a4-4ca1-8964-9b88a34d9df2',
        name: 'Lucas Rodrigues',
        username: 'nomad',
        email: 'nomad@example.com',
        imageUrl: 'nomad.jpg',
        bannerUrl: 'banner_nomad.jpg',
        location: 'New York',
        website: 'www.nomad.com',
        bio: '( ._.) ERROR: 404 Not Found'
      },
      {
        id: '9a1b1406-422a-4bc5-8ea0-4af286f3b4ce',
        name: 'Breno Zambanini',
        username: 'zamba',
        email: 'zamba@example.com',
        imageUrl: 'zamba.jpg',
        bannerUrl: 'banner_zamba.jpg',
        location: 'Phoenix',
        website: 'www.zamba.com',
        bio: 'Hello.'
      },
      {
        id: '76878ac9-c09e-4e87-86ea-1a9a273207bf',
        name: 'Unknown',
        username: 'O_o',
        email: 'inexistent@example.com',
        imageUrl: 'exist.jpg',
        bannerUrl: 'banner_exist.jpg',
        location: 'Brooklyn',
        website: 'www.unknown.com',
        bio: 'There nothing in here'
      }
    ],
    skipDuplicates: true
  });
};
