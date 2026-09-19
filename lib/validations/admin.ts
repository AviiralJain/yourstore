import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const SubcategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().nullable().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  images: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  hardware: z.array(z.string()).optional(),
  software: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  projectType: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  price: z.number().or(z.string().transform(val => Number(val))),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  stockStatus: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).optional(),
  stockQuantity: z.number().int().min(0).optional().or(z.string().transform(val => val === '' ? undefined : Number(val)).pipe(z.number().int().min(0).optional())),
});
