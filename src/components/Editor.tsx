"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  isSaving?: boolean;
}

export default function Editor({ content, onChange, isSaving }: EditorProps) {
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-p:font-body prose-headings:font-headline max-w-none focus:outline-none min-h-[500px] text-on-surface text-lg leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (isDistractionFree) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isDistractionFree]);

  if (!editor) {
    return null;
  }

  const baseBtn = "p-2 rounded-lg border-2 border-transparent hover:border-primary/30 transition-all active:scale-90";
  const activeBtn = "text-on-primary bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const inactiveBtn = "text-on-surface-variant opacity-60 hover:opacity-100";

  return (
    <div className={`transition-all duration-700 flex flex-col ${
        isDistractionFree 
        ? "fixed inset-0 z-[100] bg-[#131315] p-12" 
        : "border-2 border-on-surface/10 rounded-2xl bg-surface/40 backdrop-blur-md"
    }`}>
      {/* Toolbar */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 border-b border-on-surface/5 ${isDistractionFree ? "max-w-4xl mx-auto w-full mb-8" : ""}`}>
        <div className="flex items-center gap-1">
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${baseBtn} ${editor.isActive("bold") ? activeBtn : inactiveBtn}`}
            >
            <Bold size={16} />
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${baseBtn} ${editor.isActive("italic") ? activeBtn : inactiveBtn}`}
            >
            <Italic size={16} />
            </button>
            <div className="w-px h-6 bg-on-surface/10 mx-2"></div>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${baseBtn} ${editor.isActive("heading", { level: 1 }) ? activeBtn : inactiveBtn}`}
            >
            <Heading1 size={16} />
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${baseBtn} ${editor.isActive("heading", { level: 2 }) ? activeBtn : inactiveBtn}`}
            >
            <Heading2 size={16} />
            </button>
            <div className="w-px h-6 bg-on-surface/10 mx-2"></div>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${baseBtn} ${editor.isActive("bulletList") ? activeBtn : inactiveBtn}`}
            >
            <List size={16} />
            </button>
            <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${baseBtn} ${editor.isActive("orderedList") ? activeBtn : inactiveBtn}`}
            >
            <ListOrdered size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${baseBtn} ${editor.isActive("blockquote") ? activeBtn : inactiveBtn}`}
            >
                <Quote size={16} />
            </button>
        </div>

        <div className="flex items-center gap-6">
            {/* Obsidian Pulse Indicator */}
            <div className="flex items-center gap-3">
                <span className="font-label font-black text-[9px] uppercase tracking-widest text-on-surface-variant opacity-40">
                    {isSaving ? "Syncing Ritual..." : "Inscribed in Void"}
                </span>
                <div className={`w-2 h-2 rounded-full transition-all duration-1000 ${isSaving ? "bg-primary animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.6)]" : "bg-on-surface/20"}`}></div>
            </div>

            <button
                type="button"
                onClick={() => setIsDistractionFree(!isDistractionFree)}
                className={`${baseBtn} ${inactiveBtn}`}
                title="Distraction-Free Mode"
            >
                {isDistractionFree ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`p-8 overflow-y-auto custom-scrollbar ${isDistractionFree ? "max-w-3xl mx-auto w-full h-full" : "max-h-[600px]"}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

