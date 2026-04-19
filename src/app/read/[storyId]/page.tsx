import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LikeButton, CommentForm } from "@/components/Engagement";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ReadStoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  const session = await getServerSession(authOptions);

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      author: true,
      chapters: {
        orderBy: { order: "asc" },
      },
      likes: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!story || story.chapters.length === 0) {
    notFound();
  }

  const firstChapter = story.chapters[0];
  const isLiked = session?.user ? story.likes.some(l => l.userId === session.user.id) : false;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-8 py-4 px-6 md:px-12">
          <Link href="/" className="text-xl font-black tracking-tighter text-[#8B5CF6] font-headline">
            STORYVERSE
          </Link>
          <div className="font-label text-sm text-on-surface-variant flex gap-4">
             <Link href="/" className="hover:text-primary transition-colors">Back to Discover</Link>
          </div>
      </nav>

      <main className="w-full max-w-3xl flex flex-col gap-12 mt-8">
        <header className="flex flex-col gap-6 items-center text-center pb-8 border-b border-outline-variant/20">
            {story.genre && (
                <span className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-label uppercase tracking-wider w-max">
                  {story.genre}
                </span>
            )}
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface leading-tight tracking-tight">
                {story.title}
            </h1>
            <p className="font-label text-outline-variant text-lg">
                Written by <span className="text-primary">{story.author.name}</span>
            </p>
        </header>

        <article className="prose prose-invert prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-loose prose-p:text-[#e5e1e4]/90 max-w-none w-full" dangerouslySetInnerHTML={{ __html: firstChapter.content }} />

        <div className="w-full h-px bg-outline-variant/20 my-8"></div>

        <section className="flex flex-col gap-8 w-full">
            <div className="flex items-center justify-between">
                <LikeButton storyId={story.id} initialLiked={isLiked} initialCount={story.likes.length} />
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="font-headline text-2xl font-bold text-on-surface">Community Thoughts</h3>
                <CommentForm storyId={story.id} />
                
                <div className="flex flex-col gap-6 mt-8">
                    {story.comments.map(comment => (
                        <div key={comment.id} className="flex flex-col gap-2 p-6 bg-surface-container-low rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-label font-bold text-on-surface">{comment.user.name}</span>
                                <span className="font-label text-xs text-outline-variant">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="font-body text-on-surface/80">{comment.content}</p>
                        </div>
                    ))}
                    {story.comments.length === 0 && (
                        <p className="text-outline-variant font-label text-center py-8 italic">No thoughts yet. Be the first to share.</p>
                    )}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
