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
          "prose prose-invert prose-p:font-body prose-headings:font-headline max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-outline-variant/30 rounded-lg overflow-hidden bg-surface flex flex-col">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-surface-container-low border-b border-outline-variant/30">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("bold") ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("italic") ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-outline-variant/30 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-outline-variant/30 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("bulletList") ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("orderedList") ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-surface-container-high transition-colors ${
            editor.isActive("blockquote") ? "text-primary bg-surface-container-highest" : "text-on-surface-variant"
          }`}
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
