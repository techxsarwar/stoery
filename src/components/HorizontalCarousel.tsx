"use client";

import React, { useRef } from "react";

interface HorizontalCarouselProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export default function HorizontalCarousel({ title, subtitle, children }: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full mb-12">
      <div className="flex items-end justify-between mb-6 px-4 md:px-0">
        <div>
          <h2 className="font-headline text-3xl font-black text-on-surface tracking-tight uppercase">{title}</h2>
          {subtitle && <p className="font-body text-on-surface-variant italic">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="p-2 border-2 border-on-surface hover:bg-primary transition-colors focus:outline-none"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-2 border-2 border-on-surface hover:bg-primary transition-colors focus:outline-none"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 md:px-0 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
