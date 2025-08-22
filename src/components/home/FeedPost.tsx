'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// Dynamically import carousel to avoid SSR issues
const Carousel = dynamic(
  () => import('@/components/ui/carousel').then(mod => mod.Carousel),
  { ssr: false }
);
const CarouselContent = dynamic(
  () => import('@/components/ui/carousel').then(mod => mod.CarouselContent),
  { ssr: false }
);
const CarouselItem = dynamic(
  () => import('@/components/ui/carousel').then(mod => mod.CarouselItem),
  { ssr: false }
);
const CarouselNext = dynamic(
  () => import('@/components/ui/carousel').then(mod => mod.CarouselNext),
  { ssr: false }
);
const CarouselPrevious = dynamic(
  () => import('@/components/ui/carousel').then(mod => mod.CarouselPrevious),
  { ssr: false }
);

import type { CarouselApi } from '@/components/ui/carousel';
import PostModal from './PostModal';

interface FeedPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    post_type: string;
    featured: boolean;
    media_attachments?: Array<{ url: string }>;
    tech_stack?: string[];
    project_url?: string;
    github_url?: string;
    published_at: string;
    created_at: string;
  };
}

export default function FeedPost({ post }: FeedPostProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const postDate = new Date(post.published_at || post.created_at);
  const formattedDate = postDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);

    // Clean up
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  return (
    <article
      id={`post-${post.id}`}
      className="post-card-elevated mb-4 cursor-pointer overflow-hidden transition-colors duration-500 hover:bg-[var(--bg-tertiary)]"
      onClick={() => setModalOpen(true)}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between border-b border-[var(--border-color)] p-4">
        <div className="flex gap-3">
          {/* Mini Avatar */}
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <Image
              src="/profile.jpg" // Change to .png if you saved as PNG
              alt="Yuri's profile picture"
              width={40}
              height={40}
              className="object-cover"
              style={{ imageRendering: 'auto' }} // Or 'pixelated' for 8-bit effect
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold">yuri</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                @yap.yuri
              </span>
              <span className="text-xs text-[var(--text-muted)]">·</span>
              <span className="text-xs text-[var(--text-muted)]">
                {formattedDate}
              </span>
            </div>
            {/* Post Type Badge */}
            <div className="mt-1 flex items-center gap-2">
              {post.featured && (
                <span className="text-xs text-[var(--nord13)]">★</span>
              )}
              <span
                className={`inline-block px-2 py-0.5 text-xs font-bold ${
                  post.post_type === 'project'
                    ? 'bg-[var(--nord14)] text-[var(--bg-primary)]' // green
                    : post.post_type === 'announcement'
                      ? 'bg-[var(--nord13)] text-[var(--bg-primary)]' // yellow
                      : 'bg-[var(--nord10)] text-white' // blue for regular posts
                }`}
              >
                {post.post_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Title and excerpt */}
        <div>
          <h2
            className="mb-2 text-base leading-tight md:text-lg"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Media Preview - Not wrapped in Link so carousel is clickable */}
        {post.media_attachments && post.media_attachments.length > 0 && (
          <div className="mt-4">
            {post.media_attachments.length === 1 ? (
              // Single image
              <div className="overflow-hidden rounded-md border-2 border-[var(--border-color)]">
                <img
                  src={post.media_attachments[0]?.url}
                  alt="Post image"
                  className="aspect-video w-full object-cover"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
            ) : (
              // Multiple images - Carousel
              <div className="relative" onClick={e => e.stopPropagation()}>
                <Carousel
                  className="w-full"
                  setApi={setCarouselApi}
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {post.media_attachments.map((media, index) => (
                      <CarouselItem key={index}>
                        <div className="overflow-hidden rounded-md border-2 border-[var(--border-color)]">
                          <img
                            src={media.url}
                            alt={`Post image ${index + 1}`}
                            className="aspect-video w-full object-cover"
                            style={{ imageRendering: 'crisp-edges' }}
                            onClick={() => setModalOpen(true)}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* Improved button positioning - inside carousel area */}
                  <CarouselPrevious className="left-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] opacity-80 hover:bg-[var(--accent-primary)] hover:text-white hover:opacity-100" />
                  <CarouselNext className="right-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] opacity-80 hover:bg-[var(--accent-primary)] hover:text-white hover:opacity-100" />
                </Carousel>

                {/* Instagram-style dots indicator */}
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  {post.media_attachments.map((_, index) => (
                    <button
                      key={index}
                      onClick={e => {
                        e.stopPropagation();
                        carouselApi?.scrollTo(index);
                      }}
                      className={`block transition-all ${
                        index === currentImageIndex
                          ? 'h-2 w-2 bg-[var(--accent-primary)]'
                          : 'h-1.5 w-1.5 bg-[var(--text-muted)] hover:bg-[var(--text-secondary)]'
                      }`}
                      style={{ borderRadius: '2px' }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tech Stack */}
        {post.tech_stack && post.tech_stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {post.tech_stack.map(tech => (
              <span
                key={tech}
                className="bg-[var(--bg-tertiary)] px-2 py-0.5 font-mono text-xs text-[var(--text-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal post={post} open={modalOpen} onOpenChange={setModalOpen} />
    </article>
  );
}
