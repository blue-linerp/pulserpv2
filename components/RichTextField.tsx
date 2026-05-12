'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, ImageIcon, Italic, Minus, Strikethrough, Underline as UnderlineIcon } from 'lucide-react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';

export function RichTextField({ placeholder = 'Write your response...', onChange, onEditorReady }: { placeholder?: string; onChange?: (html: string) => void; onEditorReady?: (editor: Editor | null) => void }) {
  const editor = useEditor({ extensions: [StarterKit, Image, TextAlign.configure({ types: ['heading', 'paragraph'] }), Placeholder.configure({ placeholder })], content: '', immediatelyRender: false, onUpdate: ({ editor }) => onChange?.(editor.getHTML()) });
  const chamfer = { clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' };
  const chamferSmall = { clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)' };
  useEffect(() => {
    onEditorReady?.(editor);
  }, [editor, onEditorReady]);
  function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }
  function toggleHeading(level: 1 | 2 | 3) {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (editor.isActive('heading', { level })) {
      chain.setParagraph().run();
    } else {
      chain.setNode('heading', { level }).run();
    }
  }
  return (
    <div className="overflow-hidden border border-white/15 bg-[#080808]" style={chamfer}>
      <div className="flex h-12 flex-wrap items-center gap-2 border-b border-white/10 bg-[#0b0b0b] px-4 text-white/45">
        <ToolbarButton active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={14} /></ToolbarButton>
        <ToolbarButton active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={14} /></ToolbarButton>
        <ToolbarButton active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></ToolbarButton>
        <ToolbarButton active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough size={14} /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <ToolbarButton active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}><AlignLeft size={14} /></ToolbarButton>
        <ToolbarButton active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}><AlignCenter size={14} /></ToolbarButton>
        <ToolbarButton active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}><AlignRight size={14} /></ToolbarButton>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <ToolbarButton active={editor?.isActive('heading', { level: 1 })} onClick={() => toggleHeading(1)}>H1</ToolbarButton>
        <ToolbarButton active={editor?.isActive('heading', { level: 2 })} onClick={() => toggleHeading(2)}>H2</ToolbarButton>
        <ToolbarButton active={editor?.isActive('heading', { level: 3 })} onClick={() => toggleHeading(3)}>H3</ToolbarButton>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus size={15} /></ToolbarButton>
        <label className="grid h-7 w-7 cursor-pointer place-items-center text-white/55 transition hover:bg-[var(--red-primary)] hover:text-white" style={chamferSmall}><ImageIcon size={15} /><input type="file" accept="image/*" className="hidden" onChange={uploadImage} /></label>
      </div>
      <div onClick={() => editor?.chain().focus().run()} className="min-h-40 cursor-text p-4">
        <EditorContent editor={editor} className="min-h-32 text-sm text-white outline-none [&_.ProseMirror]:min-h-32 [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_p]:mb-2" />
      </div>
    </div>
  );
}

function ToolbarButton({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`grid h-7 min-w-7 place-items-center px-1 text-[12px] font-semibold transition hover:bg-[var(--red-primary)] hover:text-white ${active ? 'bg-[var(--red-primary)] text-white' : ''}`} style={{ clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)' }}>{children}</button>;
}
