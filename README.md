# Propex Properties - Luxury Real Estate Platform

Propex Properties is a state-of-the-art web application for discovering, comparing, and managing luxury real estate listings. Built with a modern technology stack, it offers a fast, accessible, and high-performance user experience, scoring exceptionally well on Google Lighthouse.

## 🚀 Features

- **Dynamic Property Viewing**: Smooth page transitions, framer-motion animations, and lazy-loaded assets.
- **Robust Authentication**: Fully integrated JWT-based authentication via HTTP-only cookies.
- **Interactive Tools**: Features live EMI and Loan Eligibility calculators, comprehensive property comparison functionality, and a recently viewed property tracker.
- **Advanced Admin Dashboard**: 
  - Visual insights utilizing Recharts.
  - Image upload capabilities built directly with Cloudinary.
  - Property management (Add, Edit, Delete).
  - Manage contact inquiries, site visits, and callback requests.
- **Production-Ready & Optimized**:
  - Implements SEO Best Practices (Dynamic Metadata, Open Graph, Sitemap, Robots.txt).
  - Next.js Edge Middleware for Rate Limiting & Security Headers.
  - Next.js Standalone Build output support for easy Dockerization.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: PostgreSQL (Managed via [Prisma ORM](https://www.prisma.io/))
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Image Hosting**: Cloudinary (`next-cloudinary`)

## 💻 Running Locally

### 1. Prerequisites
Ensure you have Node.js 18+ and PostgreSQL installed locally.

### 2. Environment Setup
Copy the `.env.example` file to create a `.env` file:
```bash
cp .env.example .env
```
Fill in your database connection string and secret keys.

### 3. Database Migration
Synchronize your local PostgreSQL database with the Prisma schema:
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the application.

## 🛳 Production Deployment

For detailed production guidelines, please refer to our `DEPLOYMENT_GUIDE.md`. The project is pre-configured for deployment on platforms like Vercel (using the Edge middleware), or containerized deployment using the included `Dockerfile`.

## 📚 API Reference
Please refer to `API_DOCUMENTATION.md` for a comprehensive overview of the RESTful API endpoints powering the application.
