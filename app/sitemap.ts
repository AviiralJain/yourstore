import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

export const revalidate = 3600; // Revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const routes = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/portfolio`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/workshops`, lastModified: new Date() },
    { url: `${baseUrl}/build-your-project`, lastModified: new Date() },
  ];

  try {
    await connectToDatabase();
    
    const projects = await Project.find({ active: true }).select('slug updatedAt').lean();
    projects.forEach((proj: any) => {
      routes.push({
        url: `${baseUrl}/projects/${proj.slug}`,
        lastModified: proj.updatedAt,
      });
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
