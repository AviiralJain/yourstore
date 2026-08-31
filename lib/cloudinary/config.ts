/**
 * PENDING CLOUDINARY INTEGRATION
 * This file sets up the architecture for Cloudinary media uploads.
 * Real implementation will use the 'cloudinary' npm package in the future.
 */

// import { v2 as cloudinary } from 'cloudinary';

/*
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
*/

export const uploadImage = async (file: File) => {
  // TODO: Implement actual Cloudinary upload logic here
  console.warn("Cloudinary upload called but not fully implemented yet.");
  return "https://res.cloudinary.com/demo/image/upload/sample.jpg"; // Mock return
};
