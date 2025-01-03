'use server';

import { revalidatePath } from 'next/cache';
import {
  CreateTweetActionProps,
  GetTweetsActionProps,
  GetTweetsBySearchActionProps,
  ToggleBookmarkActionProps,
  ToggleLikeActionProps
} from '@/interfaces/tweet.interface';
import prisma from '@/lib/prismadb';
import {
  CreateTweetActionType,
  DeleteBookmarksAction,
  DeleteTweetActionType,
  GetTotalBookmarkActionType,
  GetTotalTweetsActionType,
  GetTweetActionType,
  GetTweetsActionType,
  ToggleBookmarkActionType,
  ToggleLikeActionType,
  WhereFilter
} from '@/types/tweet.type';

export const createTweetAction = async ({
  userId,
  imageUrl,
  text,
  parentId,
  path
}: CreateTweetActionProps): Promise<CreateTweetActionType> => {
  try {
    return await prisma.thread.create({
      data: {
        userId,
        imageUrl,
        text,
        parentId
      }
    });
  } catch (error: any) {
    console.log('[ERROR_CREATE_TWEET_ACTION]', error);
  } finally {
    revalidatePath(path);
  }
};

export async function getTweetAction(id: string): Promise<GetTweetActionType> {
  try {
    if (!id) throw new Error('id required');

    const existingTweet = await prisma.thread.findFirst({
      where: { id }
    });

    if (!existingTweet) return;

    return await prisma.thread.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            imageUrl: true,
            name: true,
            username: true,
            followers: true,
            followings: true
          }
        },
        bookmarks: true,
        likes: true,
        _count: {
          select: {
            replies: true
          }
        }
      }
    });
  } catch (error: any) {
    console.log('[ERROR_GET_TWEET_ACTION]', error);
  }
}

export async function getTweetsAction({
  size = 30,
  page = 0,
  userId,
  isFollowing = false,
  isBookmarks = false,
  isProfile = false,
  isReplies = false,
  isLikes = false,
  parentId = ''
}: GetTweetsActionProps): Promise<GetTweetsActionType> {
  try {
    if (!userId) throw new Error('userId required');
    const skip = size * page;

    const whereFilter = {
      parentId: isReplies ? { not: null } : parentId ? parentId : null,
      user: {
        followers: isFollowing ? { some: { followingId: userId } } : undefined
      }
    } as WhereFilter;

    if (isBookmarks) {
      whereFilter.bookmarks = {
        some: {
          userId
        }
      };
    }

    if (isProfile) {
      whereFilter.userId = userId;
    }

    if (isLikes) {
      whereFilter.likes = {
        some: {
          userId
        }
      };
    }

    const data = await prisma.thread.findMany({
      where: whereFilter,
      include: {
        user: {
          select: {
            id: true,
            imageUrl: true,
            name: true,
            username: true,
            followers: true,
            followings: true
          }
        },
        bookmarks: true,
        likes: true,
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: size
    });

    const totalCount = await prisma.thread.count({
      where: whereFilter
    });
    const hasNext = Boolean(totalCount - skip - data.length);

    return {
      data,
      hasNext
    };
  } catch (error) {
    console.log('[GET_TWEETS_ACTION]', error);
  }
}

export async function getTotalTweetsAction({
  userId,
  isFollowing = false,
  isBookmarks = false,
  isProfile = false,
  isReplies = false,
  isLikes = false,
  parentId = ''
}: GetTweetsActionProps): Promise<GetTotalTweetsActionType> {
  try {
    if (!userId) throw new Error('userId required');

    const whereFilter = {
      parentId: isReplies ? { not: null } : parentId ? parentId : null,
      user: {
        followers: isFollowing ? { some: { followingId: userId } } : undefined
      }
    } as WhereFilter;

    if (isBookmarks) {
      whereFilter.bookmarks = {
        some: {
          userId
        }
      };
    }

    if (isProfile) {
      whereFilter.userId = userId;
    }

    if (isLikes) {
      whereFilter.likes = {
        some: {
          userId
        }
      };
    }

    return await prisma.thread.count({
      where: whereFilter
    });
  } catch (error) {
    console.info('[ERROR_GET_TOTAL_TWEETS_ACTION]', error);
  }
}

export async function getTweetsBySearchAction({
  size = 30,
  page = 0,
  searchQuery = ''
}: GetTweetsBySearchActionProps): Promise<GetTweetsActionType> {
  try {
    const skip = size * page;

    const whereFilter = {
      parentId: null,
      OR: [
        {
          text: {
            contains: searchQuery
          }
        },
        {
          user: {
            OR: [
              {
                name: {
                  contains: searchQuery
                }
              },
              {
                username: {
                  contains: searchQuery
                }
              }
            ]
          }
        }
      ]
    } as any;

    const data = await prisma.thread.findMany({
      where: whereFilter,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            imageUrl: true,
            followers: true,
            followings: true
          }
        },
        likes: true,
        bookmarks: true,
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: {
        likes: {
          _count: 'desc'
        }
      },
      skip,
      take: size
    });

    const remainingData = await prisma.thread.count({
      where: whereFilter
    });
    const hasNext = Boolean(remainingData - skip - data.length);

    return {
      data,
      hasNext
    };
  } catch (error) {
    console.info('[ERROR_GET_TWEETS_BY_SEARCH_ACTION]', error);
  }
}

export async function deleteTweetAction(
  id: string,
  path: string
): Promise<DeleteTweetActionType> {
  try {
    if (!id) throw new Error('id required');

    return await prisma.thread.delete({
      where: { id }
    });
  } catch (error: any) {
    console.log('[ERROR_DELETE_TWEET_ACTION]', error);
  } finally {
    revalidatePath(path);
  }
}

export async function toggleLikeAction({
  userId = '',
  threadId = '',
  path
}: ToggleLikeActionProps): Promise<ToggleLikeActionType> {
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        threadId
      }
    });

    if (existingLike) {
      return await prisma.like.delete({
        where: { id: existingLike.id }
      });
    }

    return await prisma.like.create({
      data: {
        userId,
        threadId
      }
    });
  } catch (error: any) {
    console.log('[ERROR_TOGGLE_LIKE_TWEET_ACTION]', error);
  } finally {
    revalidatePath(path);
  }
}

export async function toggleBookmarkAction({
  userId = '',
  threadId = '',
  path
}: ToggleBookmarkActionProps): Promise<ToggleBookmarkActionType> {
  try {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        threadId
      }
    });

    if (existingBookmark) {
      return await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });
    }

    return await prisma.bookmark.create({
      data: {
        userId,
        threadId
      }
    });
  } catch (error: any) {
    console.log('[ERROR_TOGGLE_BOOKMARK_TWEET_ACTION]', error);
  } finally {
    revalidatePath(path || '/home');
  }
}

export async function getTotalBookmarksAction(
  userId: string
): Promise<GetTotalBookmarkActionType> {
  try {
    if (!userId) throw new Error('userId required');

    return await prisma.thread.count({
      where: {
        bookmarks: {
          some: {
            userId
          }
        }
      }
    });
  } catch (error: any) {
    console.log('[ERROR_GET_BOOKMARKS_ACTION]', error);
  }
}

export async function deleteBookmarksAction(
  userId: string,
  path: string
): Promise<DeleteBookmarksAction> {
  try {
    if (!userId) throw new Error('userId required');

    return await prisma.bookmark.deleteMany({
      where: { userId }
    });
  } catch (error: any) {
    console.log('[ERROR_DELETE_BOOKMARKS_ACTION]', error);
  } finally {
    revalidatePath(path);
  }
}
