
# GEMINI.md

## Project Overview

This is a premium hotel booking platform built with Next.js 15, React 19, TypeScript, and TailwindCSS. It features a modern, scalable architecture with a focus on user experience and performance. The platform includes public-facing pages for searching and booking hotels, as well as dedicated dashboards for users, partners, and administrators.

**Key Technologies:**

*   **Framework:** Next.js 15 (App Router)
*   **Frontend:** React 19, TypeScript 5+
*   **Styling:** TailwindCSS 3.4+ with JIT compilation
*   **UI Components:** shadcn/ui (Radix UI primitives)
*   **State Management:** TanStack Query v5
*   **Authentication:** Clerk
*   **Database:** MongoDB with Mongoose
*   **Deployment:** Vercel (recommended), Netlify, AWS Amplify, Docker

## Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Run the Development Server:**

```bash
npm run dev
```

**3. Build for Production:**

```bash
npm run build
```

**4. Start Production Server:**

```bash
npm run start
```

**5. Linting and Type-Checking:**

```bash
npm run lint
npm run type-check
```

## Development Conventions

*   **Coding Style:** The project uses ESLint and Prettier to enforce a consistent coding style.
*   **Testing:** (TODO: Add testing information)
*   **File Naming:** Files are named using kebab-case, while components are named using PascalCase.
*   **Commits:** (TODO: Add commit message conventions)
*   **Branching:** (TODO: Add branching strategy)

## Directory Overview

*   **`app/`:** Contains the Next.js App Router, with separate layouts and pages for public, authentication, and dashboard sections.
*   **`components/`:** Contains reusable React components, including UI components from shadcn/ui, providers, and custom components like the navbar and footer.
*   **`lib/`:** Contains utility functions, including the MongoDB connection and security-related functions.
*   **`models/`:** Contains the Mongoose models for the database schema.
*   **`scripts/`:** Contains scripts for seeding the database.
*   **`types/`:** Contains TypeScript type definitions.
*   **`public/`:** Contains static assets like images and fonts.

## Key Files

*   **`package.json`:** Defines the project's dependencies, scripts, and other metadata.
*   **`next.config.js`:** Configures the Next.js application, including image optimization and typed routes.
*   **`tailwind.config.ts`:** Configures TailwindCSS, including custom themes and plugins.
*   **`middleware.ts`:** Implements authentication and authorization using Clerk.
*   **`app/layout.tsx`:** The root layout of the application, which includes the Clerk provider, theme provider, and query provider.
*   **`app/(public)/layout.tsx`:** The layout for the public-facing pages, which includes the navbar and footer.
*   **`app/(public)/page.tsx`:** The home page of the application.
*   **`components/navbar.tsx`:** The navigation bar of the application.
*   **`lib/mongodb.ts`:** Establishes the connection to the MongoDB database.
*   **`lib/security.ts`:** Provides utility functions for input sanitization and validation.

## Usage

This directory contains a web application for booking hotels. To use it, you can run the development server and open the application in your browser. You can then search for hotels, view hotel details, and book a room. You can also create an account to manage your bookings and save your favorite hotels.
