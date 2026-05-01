"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize, Minimize, ChevronLeft, ChevronRight, MessageSquareQuote, Send } from "lucide-react";
import { saveReadingProgress } from "@/actions/reading-history";
import { submitEcho } from "@/actions/echo";
import { LikeButton, CommentForm } from "@/components/Engagement";
import ReviewForm from "@/components/ReviewForm";
import ReportStory from "@/components/ReportStory";
import Navbar from "@/components/Navbar";
import PiracyGuard from "@/components/PiracyGuard";
import DOMPurify from "dompurify";
import Image from "next/image";

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentChapter = story.chapters[currentChapterIndex];
  
  const [selectedText, setSelectedText] = useState("");
  const [echoPosition, setEchoPosition] = useState({ top: 0, left: 0 });
  const [showEchoForm, setShowEchoForm] = useState(false);
  const [echoContent, setEchoContent] = useState("");
  const [echoes, setEchoes] = useState<any[]>(story.echoes || []);
  const [isSubmittingEcho, setIsSubmittingEcho] = useState(false);

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
          }, 2000);
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
          if (audioRef.current) audioRef.current.play().catch(() => {});
      } else {
          document.body.classList.remove("zen-mode-active");
          if (audioRef.current) audioRef.current.pause();
      }
      return () => {
          document.body.classList.remove("zen-mode-active");
          if (audioRef.current) audioRef.current.pause();
      }
  }, [zenMode]);

  const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && !showEchoForm) {
          const text = selection.toString().trim();
          if (text.length > 5 && text.length < 300) {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setSelectedText(text);
              setEchoPosition({ top: rect.top + window.scrollY - 50, left: rect.left + (rect.width / 2) });
          }
      } else if (!showEchoForm) {
          setSelectedText("");
      }
  };

  const handleEchoSubmit = async () => {
      if (!selectedText || !echoContent.trim() || isSubmittingEcho) return;
      setIsSubmittingEcho(true);
      const res = await submitEcho(story.id, currentChapter.id, selectedText, echoContent);
      if (res.success) {
          setEchoes(prev => [res.echo, ...prev]);
          setShowEchoForm(false);
          setEchoContent("");
          setSelectedText("");
          window.getSelection()?.removeAllRanges();
      } else {
          alert(res.error);
      }
      setIsSubmittingEcho(false);
  };

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
        <div className={`min-h-screen flex flex-col items-center w-full mx-auto pb-32 relative ${zenMode ? 'bg-[#050505] text-[#d4d4d4]' : 'bg-surface pt-24 px-6 md:px-12'}`}>
        
        <audio ref={audioRef} src="https://actions.google.com/sounds/v1/science_fiction/spaceship_interior.ogg" loop />

        {!zenMode && (
            <>
                <div className="fixed inset-0 bg-[#fdfdfa] -z-20"></div>
                <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 -z-10"></div>
                <Navbar user={user} penName={currentProfile?.pen_name} />
            </>
        )}

        <div className={`fixed z-50 ${zenMode ? 'top-4 right-4' : 'top-24 right-4 md:right-12'} flex flex-col gap-2`}>
            <button 
                onClick={() => setZenMode(!zenMode)} 
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${zenMode ? 'bg-red-900 text-red-100 hover:bg-red-800 border-2 border-red-500/50' : 'bg-on-surface text-surface hover:bg-primary'}`}
                title={zenMode ? "Exit Overdrive" : "Enter Overdrive"}
            >
                {zenMode ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            {zenMode && (
                <div className="absolute top-14 right-0 w-32 text-center text-[10px] font-black uppercase text-red-500 tracking-widest animate-pulse">
                    OVERDRIVE
                </div>
            )}
        </div>

        {selectedText && !showEchoForm && currentProfile && (
            <div 
                className="absolute z-50 animate-in zoom-in duration-200"
                style={{ top: echoPosition.top, left: echoPosition.left, transform: 'translateX(-50%)' }}
            >
                <button 
                    onClick={() => setShowEchoForm(true)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest shadow-xl border-2 ${zenMode ? 'bg-red-900 text-red-100 border-red-500 hover:bg-red-800' : 'bg-primary text-on-primary border-on-surface hover:bg-primary/90'}`}
                >
                    <MessageSquareQuote size={14} /> Leave Echo
                </button>
            </div>
        )}

        {showEchoForm && (
            <div 
                className={`absolute z-50 w-72 p-4 shadow-2xl border-4 ${zenMode ? 'bg-[#111] border-red-900' : 'bg-white border-on-surface'}`}
                style={{ top: echoPosition.top, left: echoPosition.left, transform: 'translateX(-50%)' }}
            >
                <p className={`text-xs italic mb-2 line-clamp-3 ${zenMode ? 'text-red-500/60' : 'text-on-surface/50'}`}>"{selectedText}"</p>
                <textarea 
                    autoFocus
                    value={echoContent}
                    onChange={e => setEchoContent(e.target.value)}
                    className={`w-full p-2 text-sm font-body outline-none border-2 mb-2 ${zenMode ? 'bg-[#0a0a0b] text-red-100 border-red-900 focus:border-red-500' : 'bg-surface text-on-surface border-on-surface/20 focus:border-primary'}`}
                    placeholder="Your echo..."
                    rows={3}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => {setShowEchoForm(false); setSelectedText("");}} className={`text-xs font-bold uppercase px-3 py-1 ${zenMode ? 'text-red-500/60 hover:text-red-500' : 'text-on-surface/60 hover:text-on-surface'}`}>Cancel</button>
                    <button onClick={handleEchoSubmit} disabled={isSubmittingEcho} className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest px-3 py-1 border-2 ${zenMode ? 'bg-red-900 text-red-100 border-red-500' : 'bg-primary text-on-primary border-on-surface'}`}>
                        {isSubmittingEcho ? "..." : <><Send size={12}/> Cast</>}
                    </button>
                </div>
            </div>
        )}

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
                    <h2 className="font-headline font-black text-4xl uppercase text-red-500 tracking-tighter">{story.title}</h2>
                    <p className="font-body italic mt-2 text-red-500/60">Chapter {currentChapter.order}: {currentChapter.title}</p>
                </div>
            )}

            <div className={`flex items-center justify-between border-b-2 pb-4 mb-4 ${zenMode ? 'border-red-900/50' : 'border-on-surface/10'}`}>
                <h3 className={`font-headline font-black text-2xl uppercase ${zenMode ? 'text-red-500/40' : 'text-on-surface/60'}`}>Chapter {currentChapter.order}</h3>
                <span className={`font-label font-bold text-lg uppercase ${zenMode ? 'text-red-500' : 'text-primary'}`}>{currentChapter.title}</span>
            </div>

            <article 
            ref={contentRef}
            onMouseUp={handleMouseUp}
            className={`prose prose-p:font-body prose-headings:font-headline ${zenMode ? 'prose-p:text-2xl prose-p:leading-relaxed text-red-100 prose-strong:text-red-500 selection:bg-red-900/50' : 'prose-p:text-xl prose-p:leading-[1.8] text-[#171717] bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] selection:bg-primary/30'} font-medium max-w-none w-full mb-12 transition-all duration-700`} 
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
            />

            <div className={`flex items-center justify-between py-8 border-y-2 ${zenMode ? 'border-red-900/50' : 'border-on-surface/10'}`}>
                <button 
                    onClick={goToPrev} 
                    disabled={currentChapterIndex === 0}
                    className={`flex items-center gap-2 font-headline font-black uppercase tracking-widest transition-colors disabled:opacity-30 ${zenMode ? 'text-red-500 hover:text-red-400' : 'text-on-surface hover:text-primary'}`}
                >
                    <ChevronLeft size={20} /> Prev Chapter
                </button>
                <div className={`font-label text-sm uppercase tracking-[0.3em] ${zenMode ? 'text-red-900' : 'text-on-surface-variant/50'}`}>
                    {currentChapterIndex + 1} / {story.chapters.length}
                </div>
                <button 
                    onClick={goToNext} 
                    disabled={currentChapterIndex === story.chapters.length - 1}
                    className={`flex items-center gap-2 font-headline font-black uppercase tracking-widest transition-colors disabled:opacity-30 ${zenMode ? 'text-red-500 hover:text-red-400' : 'text-on-surface hover:text-primary'}`}
                >
                    Next Chapter <ChevronRight size={20} />
                </button>
            </div>

            {echoes.length > 0 && !zenMode && (
                <section className="flex flex-col gap-6 w-full bg-surface-container p-8 md:p-12 border-4 border-on-surface/20 mt-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 font-headline text-8xl font-black text-on-surface/[0.03] select-none pointer-events-none">ECHOES</div>
                    <h3 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tighter flex items-center gap-3">
                        <MessageSquareQuote className="text-primary" /> Codex Echoes
                    </h3>
                    <p className="font-body text-on-surface-variant italic text-sm mb-4">Fragments left by other souls wandering this chapter.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {echoes.filter((e:any) => e.chapterId === currentChapter.id).map((echo:any) => (
                            <div key={echo.id} className="bg-white border-2 border-on-surface p-6 relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all z-10">
                                <div className="absolute -top-3 -left-3 bg-primary w-6 h-6 border-2 border-on-surface flex items-center justify-center">
                                    <MessageSquareQuote size={12} className="text-on-primary" />
                                </div>
                                <blockquote className="border-l-4 border-primary pl-4 py-1 mb-4">
                                    <p className="font-body italic text-sm text-on-surface-variant/80 line-clamp-3">"{echo.quote}"</p>
                                </blockquote>
                                <p className="font-body text-base font-bold text-on-surface mb-6">{echo.content}</p>
                                <div className="flex items-center gap-3 mt-auto pt-4 border-t-2 border-on-surface/5">
                                    <div className="w-6 h-6 rounded-full border-2 border-on-surface overflow-hidden relative bg-primary/20">
                                        <Image src={echo.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${echo.profile?.username || echo.id}`} alt="Avatar" fill unoptimized className="object-cover" />
                                    </div>
                                    <span className="font-headline text-xs font-black uppercase tracking-widest text-on-surface/60">{echo.profile?.full_name || echo.profile?.username || "Anonymous"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {!zenMode && (
                <section className="flex flex-col gap-8 w-full bg-white p-8 md:p-12 border-4 border-on-surface mt-8">
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
