import { prisma } from "@/lib/prisma";

export async function getRecentStories() {
  "use cache";
  return prisma.story.findMany({
    take: 10,
    where: { status: "PUBLISHED", isBanned: false },
    orderBy: { createdAt: "desc" },
    include: { 
      author: true,
      _count: { select: { likes: true } }
    },
  });
}

export async function getTrendingStories() {
  "use cache";
  return prisma.story.findMany({
    take: 10,
    where: { status: "PUBLISHED", isBanned: false },
    orderBy: { reads: "desc" },
    include: { 
      author: true,
      _count: { select: { likes: true } }
    },
  });
}

export async function getFantasyStories() {
  "use cache";
  return prisma.story.findMany({
    take: 10,
    where: { status: "PUBLISHED", isBanned: false, genre: "Fantasy" },
    orderBy: { reads: "desc" },
    include: { 
      author: true,
      _count: { select: { likes: true } }
    },
  });
}

export async function getPlatformStats() {
  "use cache";
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
  "use cache";
  return prisma.profile.findMany({
    take: 5,
    where: { stories: { some: { status: "PUBLISHED" } } },
    include: { 
      _count: { select: { stories: true, followers: true } }
    },
    orderBy: { followers: { _count: "desc" } }
  });
}

export async function getGenres() {
  "use cache";
  const dbGenres = await prisma.story.findMany({
      where: { status: "PUBLISHED", isBanned: false, genre: { not: null } },
      select: { genre: true },
      distinct: ['genre'],
      take: 12
  });
  return dbGenres.length > 0 ? dbGenres.map(g => g.genre as string) : ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Thriller"];
}

export async function getStoryContent(storyId: string) {
    "use cache";
    return prisma.story.findUnique({
      where: { id: storyId },
      include: {
        author: true,
        chapters: {
          orderBy: { order: "asc" },
        },
      },
    });
}

export async function getStoryEngagement(storyId: string, currentProfileId?: string) {
    // Uncached, fetches live likes and filtered comments
    return prisma.story.findUnique({
        where: { id: storyId },
        select: {
            reads: true,
            likes: true,
            comments: {
                where: {
                    OR: [
                        { isShadowBanned: false },
                        { profileId: currentProfileId || "none" }
                    ]
                },
                include: { profile: true },
                orderBy: { createdAt: "desc" },
            },
        }
    });
}
