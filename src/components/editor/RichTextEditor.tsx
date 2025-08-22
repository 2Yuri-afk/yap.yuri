'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content?: Record<string, unknown> | null;
  onChange?: (content: Record<string, unknown>) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write something amazing...',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--accent-primary)] hover:underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content: content ?? '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (
      editor &&
      content &&
      JSON.stringify(editor.getJSON()) !== JSON.stringify(content)
    ) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(async () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-[var(--text-secondary)] bg-[var(--bg-secondary)]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[var(--text-secondary)] p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('bold')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('italic')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('code')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          {'</>'}
        </button>
        <div className="w-px bg-[var(--text-secondary)]" />
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          H3
        </button>
        <div className="w-px bg-[var(--text-secondary)]" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('bulletList')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          UL
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('orderedList')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          OL
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('codeBlock')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          {'<>'}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('blockquote')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          &quot;
        </button>
        <div className="w-px bg-[var(--text-secondary)]" />
        <button
          type="button"
          onClick={setLink}
          className={`px-2 py-1 font-mono text-xs ${
            editor.isActive('link')
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--hover-bg)]'
          }`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className="bg-[var(--hover-bg)] px-2 py-1 font-mono text-xs"
        >
          IMG
        </button>
        <div className="w-px bg-[var(--text-secondary)]" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="bg-[var(--hover-bg)] px-2 py-1 font-mono text-xs disabled:opacity-50"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="bg-[var(--hover-bg)] px-2 py-1 font-mono text-xs disabled:opacity-50"
        >
          ↷
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Character count */}
      <div className="border-t-2 border-[var(--text-secondary)] p-2 font-mono text-xs text-[var(--text-muted)]">
        {editor.storage.characterCount?.characters()} characters
      </div>
    </div>
  );
}
