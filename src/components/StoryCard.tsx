import Link from "next/link";
import { Eye, Heart } from "lucide-react";

interface StoryCardProps {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  genre?: string | null;
  reads?: number;
  likes?: number;
}

export default function StoryCard({ id, title, author, coverUrl, genre, reads = 0, likes = 0 }: StoryCardProps) {
  return (
    <Link href={`/read/${id}`} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] snap-start group">
      <div className="relative aspect-[2/3] w-full bg-surface-container border-2 border-on-surface overflow-hidden transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px_var(--color-primary)] group-hover:-translate-x-1 group-hover:-translate-y-1">
        <img 
          src={coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {genre && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-on-primary text-[9px] font-black uppercase tracking-widest border border-on-surface">
            {genre}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div className="flex gap-3 text-surface font-headline font-black text-[10px] uppercase">
                <span className="flex items-center gap-1"><Eye size={12} strokeWidth={3} /> {reads > 1000 ? `${(reads/1000).toFixed(1)}k` : reads}</span>
                <span className="flex items-center gap-1"><Heart size={12} strokeWidth={3} /> {likes > 1000 ? `${(likes/1000).toFixed(1)}k` : likes}</span>
            </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-headline font-black text-xs sm:text-sm md:text-base uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-label text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          By {author}
        </p>
      </div>
    </Link>
  );
}
