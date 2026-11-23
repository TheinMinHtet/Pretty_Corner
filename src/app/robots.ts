import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pretty-corner.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/order-confirmation',
        '/payment-pending',
        '/payment-recovery',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
