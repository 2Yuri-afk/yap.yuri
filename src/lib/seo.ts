import { Metadata } from 'next';

export const siteConfig = {
  name: '8bit Blog',
  description: 'A retro-themed personal blog with 8-bit aesthetics',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/og-image.png',
  twitterHandle: '@yourusername',
  author: 'Your Name',
  keywords: ['blog', '8bit', 'retro', 'personal', 'tech'],
};

interface GenerateSEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

export function generateSEO({
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false,
  canonical,
}: GenerateSEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const imageUrl = pageImage.startsWith('http')
    ? pageImage
    : `${siteConfig.url}${pageImage}`;

  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: tags || siteConfig.keywords,
    authors: author ? [{ name: author }] : [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,

    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || undefined,
    },

    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    openGraph: {
      type: article ? 'article' : 'website',
      title: pageTitle,
      description: pageDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: 'en_US',
      ...(article && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : [siteConfig.author],
        tags,
      }),
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },

    verification: {
      // Add your verification codes here
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };

  return metadata;
}

// Dynamic OG Image URL generator
export function generateOGImageURL(
  title: string,
  description?: string
): string {
  // This assumes you're using Vercel OG or a similar service
  // Adjust based on your actual OG image generation strategy
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });

  return `/api/og?${params.toString()}`;
}
