# YOURSTORE Backend Setup

This document outlines the Phase 1 backend foundation setup for YOURSTORE. The architecture is optimized for Next.js, Mongoose, and Vercel serverless deployment.

## Technology Stack
- **Framework:** Next.js 16.3 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Image Storage:** Cloudinary (prepared)
- **Validation:** Zod (installed for future complex payload validation)
- **Authentication:** Prepared for NextAuth.js (Auth.js)

## Environment Variables
Create a `.env.local` file at the root of the project by copying `.env.example`.
The minimum required variables are:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## Local Development Setup
1. Ensure you have installed the newly added dependencies: `npm install`
2. Configure `.env.local` with a valid MongoDB URI.
3. Run the development server: `npm run dev`

## Database Models
Located in `lib/models/`:
- **Category:** The top-level category (e.g., DRONE, ROBOTICS).
- **Subcategory:** Nested within a Category (e.g., Motors, ESCs).
- **Product:** The individual components sold. Tied to a Category (and optional Subcategory).
- **Project:** Completed custom UAV builds showcased on the platform.
- **Enquiry:** Custom project requirement submissions from users.

## API Endpoints
All API endpoints are implemented as Next.js Route Handlers in the `app/api/` directory.

### Public Routes
- `GET /api/categories` - Returns active categories.
- `GET /api/products` - Returns active products. Accepts optional `categoryId` or `subcategoryId` query params.
- `POST /api/enquiries` - Submits a new custom project requirement.

### Admin Routes (Protected)
- `GET / POST /api/admin/categories` - Manage categories.
- `GET / POST /api/admin/products` - Manage products.
- `GET /api/admin/enquiries` - View incoming project requirements.
- `PATCH /api/admin/enquiries/[id]` - Update the status of an enquiry.

## Security Notes
- **Authentication Status:** A stub exists at `lib/auth/adminAuth.ts`. Currently, admin routes will reject requests without a dummy Bearer token in production mode. Full NextAuth.js integration is scheduled for Phase 2.
- **MongoDB Connection:** Implemented with global caching in `lib/db/mongodb.ts` to prevent excessive connections during hot reloads in development.

## Next Implementation Phase (Phase 2)
The next step is to implement the **Admin Dashboard UI** to consume these admin APIs, allowing the team to insert real data (Categories, Products, Projects). Once the database is populated with real client-approved content, the frontend UI will be migrated to fetch from the database instead of using the current hardcoded mock data.
