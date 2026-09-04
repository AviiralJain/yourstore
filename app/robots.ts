import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/api/', '/cart'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
