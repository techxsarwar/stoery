import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getRecentStories = unstable_cache(
  async () => {
    return prisma.story.findMany({
      take: 10,
      where: { status: "PUBLISHED", isBanned: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        cover_url: true,
        genre: true,
        reads: true,
        author: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true
          }
        },
        _count: { select: { likes: true } }
      }
    });
  },
  ["recent-stories"],
  { revalidate: 60 }
);

export const getTrendingStories = unstable_cache(
  async () => {
    return prisma.story.findMany({
      take: 10,
      where: { status: "PUBLISHED", isBanned: false },
      orderBy: { reads: "desc" },
      select: {
          id: true,
          title: true,
          cover_url: true,
          genre: true,
          reads: true,
          author: {
            select: {
              id: true,
              username: true,
              full_name: true,
              avatar_url: true
            }
          },
          _count: { select: { likes: true } }
        }
    });
  },
  ["trending-stories"],
  { revalidate: 120 }
);

export const getFantasyStories = unstable_cache(
  async () => {
    return prisma.story.findMany({
      take: 10,
      where: { status: "PUBLISHED", isBanned: false, genre: "Fantasy" },
      orderBy: { reads: "desc" },
      select: {
          id: true,
          title: true,
          cover_url: true,
          genre: true,
          reads: true,
          author: {
            select: {
              id: true,
              username: true,
              full_name: true,
              avatar_url: true
            }
          },
          _count: { select: { likes: true } }
        }
    });
  },
  ["fantasy-stories"],
  { revalidate: 300 }
);

export const getPlatformStats = unstable_cache(
  async () => {
    const totalStories = await prisma.story.count({ where: { status: "PUBLISHED", isBanned: false } });
    const totalAuthors = await prisma.profile.count();
    const totalReadsAgg = await prisma.story.aggregate({
        _sum: { reads: true }
    });
    const totalReads = totalReadsAgg._sum.reads || 0;
    
    return { totalStories, totalAuthors, totalReads };
  },
  ["platform-stats"],
  { revalidate: 3600 } // Stats only need to update once an hour for performance
);

export const getTopAuthors = unstable_cache(
  async () => {
    return prisma.profile.findMany({
      take: 5,
      where: { stories: { some: { status: "PUBLISHED" } } },
      select: {
          id: true,
          username: true,
          full_name: true,
          avatar_url: true,
          _count: { select: { stories: true, followers: true } }
      },
      orderBy: { followers: { _count: "desc" } }
    });
  },
  ["top-authors"],
  { revalidate: 3600 }
);

export const getGenres = unstable_cache(
  async () => {
    const dbGenres = await prisma.story.findMany({
        where: { status: "PUBLISHED", isBanned: false, genre: { not: null } },
        select: { genre: true },
        distinct: ['genre'],
        take: 12
    });
    return dbGenres.length > 0 ? dbGenres.map(g => g.genre as string) : ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Thriller"];
  },
  ["genres-list"],
  { revalidate: 86400 } // Genres rarely change
);

export const getMasterpieceStories = unstable_cache(
  async () => {
    return prisma.story.findMany({
      take: 10,
      where: { status: "PUBLISHED", isBanned: false },
      orderBy: { likes: { _count: "desc" } },
      select: {
          id: true,
          title: true,
          cover_url: true,
          genre: true,
          reads: true,
          author: {
            select: {
              id: true,
              username: true,
              full_name: true,
              avatar_url: true
            }
          },
          _count: { select: { likes: true } }
        }
    });
  },
  ["masterpiece-stories"],
  { revalidate: 3600 }
);

export const getRecentReviews = unstable_cache(
  async () => {
    return prisma.review.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      where: { rating: { gte: 4 }, story: { status: "PUBLISHED", isBanned: false } },
      include: {
        profile: { select: { full_name: true, username: true, avatar_url: true } },
        story: { select: { id: true, title: true, cover_url: true } }
      }
    });
  },
  ["recent-reviews"],
  { revalidate: 300 }
);

export const getEchoOfTheDay = unstable_cache(
  async () => {
    return prisma.echo.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        profile: { select: { full_name: true, username: true, avatar_url: true, pen_name: true } },
        story:   { select: { id: true, title: true, cover_url: true } }
      }
    });
  },
  ["echo-of-the-day"],
  { revalidate: 3600 }
);

export const getStreakLeaderboard = unstable_cache(
  async () => {
    return prisma.profile.findMany({
      take: 5,
      where: { reading_streak: { gt: 0 } },
      orderBy: { reading_streak: "desc" },
      select: {
        id: true,
        username: true,
        full_name: true,
        pen_name: true,
        avatar_url: true,
        reading_streak: true,
        longest_streak: true
      }
    });
  },
  ["streak-leaderboard"],
  { revalidate: 1800 }
);

export const getNowReading = unstable_cache(
  async () => {
    const since = new Date(Date.now() - 30 * 60 * 1000); // last 30 min
    return prisma.readingHistory.findMany({
      take: 8,
      where: { lastReadAt: { gte: since } },
      orderBy: { lastReadAt: "desc" },
      distinct: ["storyId"],
      include: {
        story: { select: { id: true, title: true, genre: true } }
      }
    });
  },
  ["now-reading"],
  { revalidate: 60 }
);

export async function getStoryContent(storyId: string) {
    return prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        title: true,
        content: true,
        genre: true,
        cover_url: true,
        description: true,
        reads: true,
        isBanned: true,
        banReason: true,
        isPermanentBan: true,
        banExpiresAt: true,
        author: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true
          }
        },
        chapters: {
          orderBy: { order: "asc" },
          select: {
              id: true,
              title: true,
              content: true,
              order: true
          }
        },
      }
    });
}

export async function getStoryEngagement(storyId: string, currentProfileId?: string) {
    return prisma.story.findUnique({
        where: { id: storyId },
        select: {
            reads: true,
            likes: {
                select: { profileId: true }
            },
            comments: {
                where: { isShadowBanned: false },
                orderBy: { createdAt: "desc" },
                include: { 
                    profile: { select: { full_name: true, username: true, avatar_url: true } } 
                }
            },
            echoes: {
                orderBy: { createdAt: "desc" },
                include: { 
                    profile: { select: { full_name: true, username: true, avatar_url: true } } 
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: { where: { isShadowBanned: false } },
                    echoes: true
                }
            }
        }
    });
}