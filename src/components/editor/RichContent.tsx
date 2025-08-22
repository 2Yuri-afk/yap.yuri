'use client';

import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';

interface RichContentProps {
  content: Record<string, unknown> | null;
  className?: string;
}

const extensions = [
  StarterKit,
  Image,
  Link.configure({
    HTMLAttributes: {
      class: 'text-[var(--accent-primary)] hover:underline',
    },
  }),
  Typography,
];

export default function RichContent({
  content,
  className = '',
}: RichContentProps) {
  if (!content) {
    return null;
  }

  const html = generateHTML(content, extensions);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
