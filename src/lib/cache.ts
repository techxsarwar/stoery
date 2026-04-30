import { prisma } from "@/lib/prisma";

export async function getRecentStories() {
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
}

export async function getTrendingStories() {
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
}

export async function getFantasyStories() {
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
}

export async function getPlatformStats() {
  const [totalStories, totalAuthors, totalReads] = await Promise.all([
    prisma.story.count({ where: { status: "PUBLISHED", isBanned: false } }),
    prisma.profile.count(),
    prisma.story.aggregate({
        _sum: { reads: true }
    })
  ]);
  return { totalStories, totalAuthors, totalReads };
}

export async function getTopAuthors() {
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
}

export async function getGenres() {
  const dbGenres = await prisma.story.findMany({
      where: { status: "PUBLISHED", isBanned: false, genre: { not: null } },
      select: { genre: true },
      distinct: ['genre'],
      take: 12
  });
  return dbGenres.length > 0 ? dbGenres.map(g => g.genre as string) : ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Thriller"];
}

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
            _count: {
                select: {
                    likes: true,
                    comments: { where: { isShadowBanned: false } }
                }
            }
        }
    });
}