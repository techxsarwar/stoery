"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-p:font-body prose-headings:font-headline max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const baseBtn = "p-2 rounded border-2 border-transparent hover:border-on-surface transition-all";
  const activeBtn = "text-on-primary bg-primary border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
  const inactiveBtn = "text-on-surface";

  return (
    <div className="border-2 border-on-surface rounded bg-white flex flex-col focus-within:ring-4 focus-within:ring-primary/50 transition-all duration-300">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-surface border-b-2 border-on-surface">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${baseBtn} ${editor.isActive("bold") ? activeBtn : inactiveBtn}`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${baseBtn} ${editor.isActive("italic") ? activeBtn : inactiveBtn}`}
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-on-surface mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${baseBtn} ${editor.isActive("heading", { level: 1 }) ? activeBtn : inactiveBtn}`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${baseBtn} ${editor.isActive("heading", { level: 2 }) ? activeBtn : inactiveBtn}`}
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-on-surface mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${baseBtn} ${editor.isActive("bulletList") ? activeBtn : inactiveBtn}`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${baseBtn} ${editor.isActive("orderedList") ? activeBtn : inactiveBtn}`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${baseBtn} ${editor.isActive("blockquote") ? activeBtn : inactiveBtn}`}
        >
          <Quote size={18} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
