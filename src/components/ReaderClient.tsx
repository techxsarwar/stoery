"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";
import { saveReadingProgress } from "@/actions/reading-history";
import { LikeButton, CommentForm } from "@/components/Engagement";
import ReviewForm from "@/components/ReviewForm";
import ReportStory from "@/components/ReportStory";
import Navbar from "@/components/Navbar";
import PiracyGuard from "@/components/PiracyGuard";
import DOMPurify from "dompurify";

export default function ReaderClient({ story, currentProfile, initialChapterId, initialProgress, user }: any) {
  const [zenMode, setZenMode] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
     if (initialChapterId) {
         const idx = story.chapters.findIndex((c: any) => c.id === initialChapterId);
         return idx >= 0 ? idx : 0;
     }
     return 0;
  });
  
  const contentRef = useRef<HTMLDivElement>(null);
  const currentChapter = story.chapters[currentChapterIndex];
  
  // Handle auto-scrolling on load
  useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (initialProgress > 0 && initialProgress < 1 && contentRef.current) {
          timeoutId = setTimeout(() => {
              const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
              window.scrollTo({ top: scrollHeight * initialProgress, behavior: "smooth" });
          }, 500);
      }
      return () => {
          if (timeoutId) clearTimeout(timeoutId);
      };
  }, [initialProgress]);

  // Handle auto-bookmarking on scroll
  useEffect(() => {
      if (!currentProfile) return;
      
      let timeoutId: any;
      const handleScroll = () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
              const scrollTop = document.documentElement.scrollTop;
              const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
              const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
              
              saveReadingProgress(story.id, currentChapter.id, progress);
          }, 2000); // Debounce for 2 seconds
      };
      
      window.addEventListener("scroll", handleScroll);
      return () => {
          window.removeEventListener("scroll", handleScroll);
          clearTimeout(timeoutId);
      };
  }, [currentProfile, story.id, currentChapter.id]);

  useEffect(() => {
      if (zenMode) {
          document.body.classList.add("zen-mode-active");
      } else {
          document.body.classList.remove("zen-mode-active");
      }
      return () => document.body.classList.remove("zen-mode-active");
  }, [zenMode]);

  const goToPrev = () => {
      if (currentChapterIndex > 0) {
          setCurrentChapterIndex(currentChapterIndex - 1);
          window.scrollTo({ top: 0 });
      }
  };

  const goToNext = () => {
      if (currentChapterIndex < story.chapters.length - 1) {
          setCurrentChapterIndex(currentChapterIndex + 1);
          window.scrollTo({ top: 0 });
      }
  };

  const isLiked = currentProfile ? story.likes.some((l: any) => l.profileId === currentProfile.id) : false;
    const [sanitizedContent, setSanitizedContent] = useState(currentChapter.content);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSanitizedContent(DOMPurify.sanitize(currentChapter.content));
        }
    }, [currentChapter.content]);

    const watermarkIdentifier = currentProfile?.pen_name || user?.email || "GUEST_READER";

    return (
    <PiracyGuard watermarkText={watermarkIdentifier}>
        <div className={`min-h-screen flex flex-col items-center w-full mx-auto pb-32 relative ${zenMode ? 'bg-[#fdfdfa]' : 'bg-surface pt-24 px-6 md:px-12'}`}>
        
        {!zenMode && (
            <>
                <div className="fixed inset-0 bg-[#fdfdfa] -z-20"></div>
                <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 -z-10"></div>
                <Navbar user={user} penName={currentProfile?.pen_name} />
            </>
        )}

        {/* Floating Zen Controls */}
        <div className={`fixed z-50 ${zenMode ? 'top-4 right-4' : 'top-24 right-4 md:right-12'} flex flex-col gap-2`}>
            <button 
                onClick={() => setZenMode(!zenMode)} 
                className="w-12 h-12 bg-on-surface text-surface rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-colors"
                title={zenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
            >
                {zenMode ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
        </div>

        <main className={`w-full ${zenMode ? 'max-w-4xl py-24 px-8' : 'max-w-3xl mt-8'} flex flex-col gap-12 transition-all duration-700`}>
            {!zenMode && (
                <header className="flex flex-col gap-6 items-center text-center pb-12 border-b-8 border-primary">
                    {story.genre && (
                        <span className="inline-block px-4 py-1.5 bg-primary text-on-primary border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-headline text-sm font-bold uppercase tracking-widest w-max mb-4">
                        {story.genre}
                        </span>
                    )}
                    <h1 className="font-headline text-6xl md:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter uppercase mb-4">
                        {story.title}
                    </h1>
                    <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">
                        By <span className="text-on-surface border-b-4 border-primary pb-1">{story.author.full_name || "Unknown Author"}</span>
                    </p>
                    <div className="flex items-center gap-4 text-on-surface-variant font-label text-sm uppercase tracking-widest">
                        <span>{story.chapters.length} Chapters</span>
                        <span>•</span>
                        <span>{story.reads} Souls Reached</span>
                    </div>
                </header>
            )}

            {zenMode && (
                <div className="text-center mb-12 opacity-30 hover:opacity-100 transition-opacity">
                    <h2 className="font-headline font-black text-4xl uppercase">{story.title}</h2>
                    <p className="font-body italic mt-2">Chapter {currentChapter.order}: {currentChapter.title}</p>
                </div>
            )}

            <div className="flex items-center justify-between border-b-2 border-on-surface/10 pb-4 mb-4">
                <h3 className="font-headline font-black text-2xl uppercase text-on-surface/60">Chapter {currentChapter.order}</h3>
                <span className="font-label font-bold text-lg text-primary uppercase">{currentChapter.title}</span>
            </div>

            <article 
            ref={contentRef}
            className={`prose prose-p:font-body prose-headings:font-headline ${zenMode ? 'prose-p:text-2xl prose-p:leading-loose text-[#222]' : 'prose-p:text-xl prose-p:leading-[1.8] text-[#171717] bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'} font-medium max-w-none w-full mb-12 transition-all duration-700`} 
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
            />

            <div className="flex items-center justify-between py-8 border-y-2 border-on-surface/10">
                <button 
                    onClick={goToPrev} 
                    disabled={currentChapterIndex === 0}
                    className="flex items-center gap-2 font-headline font-black uppercase tracking-widest text-on-surface hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-on-surface"
                >
                    <ChevronLeft size={20} /> Prev Chapter
                </button>
                <div className="font-label text-sm uppercase tracking-[0.3em] text-on-surface-variant/50">
                    {currentChapterIndex + 1} / {story.chapters.length}
                </div>
                <button 
                    onClick={goToNext} 
                    disabled={currentChapterIndex === story.chapters.length - 1}
                    className="flex items-center gap-2 font-headline font-black uppercase tracking-widest text-on-surface hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-on-surface"
                >
                    Next Chapter <ChevronRight size={20} />
                </button>
            </div>

            {!zenMode && (
                <section className="flex flex-col gap-8 w-full bg-white p-8 md:p-12 border-4 border-on-surface">
                    <div className="flex items-center justify-between">
                        <h3 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tighter">Engagement</h3>
                        <LikeButton storyId={story.id} initialLiked={isLiked} initialCount={story.likes.length} />
                    </div>

                    <div className="flex flex-col gap-8 mt-4">
                        <ReviewForm storyId={story.id} />
                        <CommentForm storyId={story.id} />
                        
                        <div className="flex justify-center border-t-2 border-on-surface/5 pt-8">
                        <ReportStory storyId={story.id} />
                        </div>

                        <div className="flex flex-col gap-6 mt-8">
                            {story.comments.map((comment: any) => (
                                <div key={comment.id} className="flex flex-col gap-3 p-6 bg-surface border-2 border-outline-variant relative">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                                    <div className="flex items-center justify-between pl-4">
                                        <span className="font-headline font-bold text-lg text-on-surface uppercase">{comment.profile.full_name || "Anonymous"}</span>
                                        <span className="font-label font-medium text-sm text-outline-variant">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="font-body text-xl font-medium text-on-surface pl-4">{comment.content}</p>
                                </div>
                            ))}
                            {story.comments.length === 0 && (
                                <div className="p-12 border-4 border-dashed border-outline-variant text-center">
                                <p className="text-on-surface-variant font-headline font-bold text-xl uppercase tracking-wide">No thoughts yet. Have your say.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
        </div>
    </PiracyGuard>
  );
}
