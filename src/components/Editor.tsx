"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Maximize2, Minimize2, Wand2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  isSaving?: boolean;
}

export default function Editor({ content, onChange, isSaving }: EditorProps) {
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-p:font-body prose-headings:font-headline max-w-none focus:outline-none min-h-[500px] text-on-surface text-lg leading-relaxed",
      },
    },
    immediatelyRender: false,
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

  const baseBtn = "p-2 rounded-lg border-2 border-transparent hover:border-primary/30 transition-all active:scale-90 flex items-center justify-center";
  const activeBtn = "text-on-primary bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const inactiveBtn = "text-on-surface-variant opacity-60 hover:opacity-100";

  const handleAiAction = async (action: "continue" | "polish") => {
      if (!editor) return;
      
      const selection = editor.state.selection;
      let textToProcess = "";
      let isSelection = false;

      if (!selection.empty) {
          textToProcess = editor.state.doc.textBetween(selection.from, selection.to, ' ');
          isSelection = true;
      } else {
          // If no selection, for continue we take the last paragraph, for polish we require selection
          if (action === "polish") {
              setAiError("Select text to polish.");
              setTimeout(() => setAiError(""), 3000);
              return;
          }
          const textBeforeCursor = editor.state.doc.textBetween(Math.max(0, selection.from - 500), selection.from, ' ');
          textToProcess = textBeforeCursor;
      }

      setIsAiLoading(true);
      setAiError("");

      try {
          const res = await fetch("/api/ai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  action, 
                  text: textToProcess, 
                  context: editor.getText().substring(0, 1000) 
              })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          if (action === "polish" && isSelection) {
              editor.chain().focus().deleteSelection().insertContent(data.text).run();
          } else {
              editor.chain().focus().insertContent(data.text ? `\n\n${data.text}` : "").run();
          }
      } catch (e: any) {
          setAiError(e.message || "AI failed to respond.");
          setTimeout(() => setAiError(""), 5000);
      } finally {
          setIsAiLoading(false);
      }
  };

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
            
            <div className="w-px h-6 bg-on-surface/10 mx-2"></div>
            
            <div className="relative group">
                <button
                    type="button"
                    disabled={isAiLoading}
                    className={`${baseBtn} text-emerald-600 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500 disabled:opacity-50 gap-2 px-3`}
                >
                    {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    <span className="font-headline font-black text-[10px] uppercase tracking-widest hidden sm:inline">AI Co-Pilot</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button type="button" onClick={() => handleAiAction('continue')} className="text-left px-4 py-3 font-headline font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 text-on-surface border-b border-on-surface/10">
                        Auto-Continue
                    </button>
                    <button type="button" onClick={() => handleAiAction('polish')} className="text-left px-4 py-3 font-headline font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 text-on-surface">
                        Polish Selection
                    </button>
                </div>
            </div>
            {aiError && (
                <span className="text-error font-label font-bold text-[10px] uppercase tracking-widest absolute -top-6 left-0 w-max bg-error/10 px-2 py-1">
                    {aiError}
                </span>
            )}
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

