# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoringFunnel is a high-performance Next.js 14 landing page designed for technical creators and developers to convert visitors into customers. The project emphasizes conversion rate optimization (CRO) with comprehensive analytics tracking.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format

# Check formatting
npm run format:check
```

## Architecture & Tech Stack

### Core Technologies
- **Next.js 14** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Supabase** for backend services
- **Google Analytics 4** for analytics

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Organized by feature:
  - `layout/` - Page sections (header, hero, features, footer)
  - `ui/` - Reusable UI components
  - `cro/` - Conversion optimization components
  - `analytics/` - Analytics tracking components
- `src/lib/` - Utility functions and integrations
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions

### Key Features

#### Conversion Rate Optimization (CRO)
The project includes an extensive CRO system (`src/components/cro/`) with:
- Exit intent detection (desktop and mobile)
- Scroll-based triggers and progress tracking
- Multi-step forms with auto-save
- Scarcity counters and countdown timers
- Social proof notifications
- Sticky CTAs

Use the `CROLayout` component for easy integration of all CRO features.

#### Analytics Integration
Comprehensive GA4 tracking is built-in (`src/lib/analytics.ts`):
- Automatic page view tracking
- Scroll depth milestones (25%, 50%, 75%, 100%)
- Time on page tracking
- Form submission tracking
- Button click tracking
- Custom event utilities

### Environment Variables

Required variables in `.env.local`:
```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Analytics (Optional but recommended)
NEXT_PUBLIC_GA_TRACKING_ID=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BoringFunnel
```

### Path Aliases
The project uses `@/` as an alias for `./src/` directory. Always use this in imports:
```tsx
import { Button } from '@/components/ui/button'
```

### Code Conventions
- Use functional components with TypeScript
- Prefer `'use client'` directive only when necessary
- Use Tailwind CSS for styling (no inline styles)
- Follow existing component patterns in the codebase
- Maintain responsive design with mobile-first approach

### Testing & Quality
- TypeScript strict mode is enabled
- ESLint configured with Next.js and Prettier
- Always run `npm run lint` and `npm run typecheck` before completion

### Performance Considerations
- Images use Next.js Image component with optimization
- Lazy loading implemented for below-fold content
- Passive event listeners for scroll events
- localStorage used for persistence (with fallbacks)