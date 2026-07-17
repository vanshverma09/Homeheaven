# Propex Properties Deployment Guide

This guide provides step-by-step instructions for deploying Propex Properties into production using Docker or Vercel.

---

## 1. Environment Preparation

Regardless of your hosting platform, you must ensure your environment variables are configured securely. Do **not** commit your `.env` file to version control.

### Required Variables:
- `DATABASE_URL`: Must point to a production-grade PostgreSQL database (e.g., Supabase, Neon, AWS RDS).
- `JWT_SECRET`: A long, randomly generated secret string for secure session handling.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Required for the admin property image upload functionality.

---

## 2. Docker Deployment (AWS EC2, DigitalOcean, Linode)

The repository includes a highly-optimized multi-stage `Dockerfile` configured to leverage Next.js's "Standalone" output mode, reducing the final image size dramatically.

### Steps:

1. **Build the image**:
   ```bash
   docker build -t propex-properties:latest .
   ```

2. **Run the container**:
   Ensure you pass your environment variables at runtime or via an `.env` file mounted to the container.
   ```bash
   docker run -p 3000:3000 --env-file .env.production propex-properties:latest
   ```

3. **Database Migrations**:
   The `Dockerfile` handles `npx prisma generate` during the build phase. However, for a production database, you should explicitly run migrations before starting the app:
   ```bash
   npx prisma migrate deploy
   ```

---

## 3. Vercel Deployment (Recommended)

Next.js natively operates perfectly on Vercel, which will automatically configure Edge middleware and static asset CDN routing.

1. **Push your code to GitHub**.
2. **Import the repository** in your Vercel Dashboard.
3. Under **Environment Variables**, add the keys defined in `.env.example`.
4. Ensure the **Build Command** is set to `npm run build` and **Install Command** to `npm install`.
5. Click **Deploy**. Vercel will automatically provision the edge functions and serverless routes.

---

## 4. Performance & Post-Deployment

- **Image Optimization**: The application leverages `next/image`. Ensure your hosting provider permits the domains defined in `next.config.ts`.
- **Rate Limiting**: Our built-in Edge middleware rate-limits API requests to prevent basic abuse. For large-scale production, consider integrating Upstash Redis into `middleware.ts`.
- **Security Check**: Verify your JWTs are successfully writing via `httpOnly` cookies in the browser. 
