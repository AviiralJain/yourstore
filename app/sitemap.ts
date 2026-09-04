import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Project from '@/lib/models/Project';

export const revalidate = 3600; // Revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const routes = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/build-your-project`, lastModified: new Date() },
  ];

  try {
    await connectToDatabase();
    
    Category.init();
    Subcategory.init();

    const categories = await Category.find({ isActive: true }).select('slug updatedAt').lean();
    categories.forEach((cat: any) => {
      routes.push({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: cat.updatedAt,
      });
    });

    const subcategories = await Subcategory.find({ isActive: true })
      .populate('categoryId', 'slug isActive')
      .select('slug updatedAt categoryId')
      .lean();
      
    subcategories.forEach((subcat: any) => {
      if (subcat.categoryId && subcat.categoryId.isActive) {
        routes.push({
          url: `${baseUrl}/categories/${subcat.categoryId.slug}/${subcat.slug}`,
          lastModified: subcat.updatedAt,
        });
      }
    });

    const products = await Product.find({ isActive: true }).select('slug updatedAt').lean();
    products.forEach((prod: any) => {
      routes.push({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: prod.updatedAt,
      });
    });

    const projects = await Project.find({ isActive: true }).select('slug updatedAt').lean();
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
