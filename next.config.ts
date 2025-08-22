import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isPreview = process.env.VERCEL_ENV === 'preview';

// Content Security Policy configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https: http:;
  media-src 'self' https: http:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.spotify.com ${isDev ? 'ws://localhost:3000 http://localhost:3000' : ''};
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), browsing-topics=(), accelerometer=(), autoplay=(), encrypted-media=(), gyroscope=(), magnetometer=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()',
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
];

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Allow less restrictive CSP for preview deployments
      ...(isPreview
        ? [
            {
              source: '/:path*',
              headers: [
                {
                  key: 'Content-Security-Policy',
                  value: ContentSecurityPolicy.replace(
                    'upgrade-insecure-requests;',
                    ''
                  )
                    .replace(/\s{2,}/g, ' ')
                    .trim(),
                },
              ],
            },
          ]
        : []),
    ];
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,

  // React strict mode for better error detection
  reactStrictMode: true,

  // Generate standalone output for Docker deployment
  output: 'standalone',
};

export default nextConfig;
