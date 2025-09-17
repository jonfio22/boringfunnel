# BoringFunnel - Landing Page for Technical Creators

A modern, high-performance landing page template built with Next.js 14, TypeScript, and Tailwind CSS. Designed specifically for technical creators and developers who want to convert visitors into customers.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for smooth animations
- **React Hook Form** for form handling
- **Supabase** integration ready
- **Next Themes** for dark mode support
- **ESLint & Prettier** for code quality
- **Responsive Design** - mobile-first approach
- **SEO Optimized** with proper meta tags
- **Performance Optimized** for Core Web Vitals

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── cta.tsx
│   │   └── footer.tsx
│   ├── ui/              # UI components
│   │   └── contact-form.tsx
│   └── theme-provider.tsx
├── hooks/               # Custom React hooks
│   ├── use-local-storage.ts
│   └── use-intersection-observer.ts
├── lib/                 # Utility functions
│   ├── utils.ts
│   └── supabase.ts
├── styles/              # Global styles
│   └── globals.css
└── types/               # TypeScript type definitions
    └── index.ts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`:
```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BoringFunnel
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎨 Customization

### Colors & Theming

The project uses CSS custom properties for theming. Update the color scheme in `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more colors */
}
```

### Components

All components are located in `src/components/` and can be easily customized:

- **Header**: Navigation and branding
- **Hero**: Main landing section with CTA
- **Features**: Feature showcase with icons
- **CTA**: Call-to-action section
- **Footer**: Links and contact information

### Typography

The project uses Inter font family by default. You can change it in `src/app/layout.tsx`:

```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

## 🔌 Integrations

### Supabase

Database client is configured in `src/lib/supabase.ts`. Update your environment variables and start using Supabase:

```tsx
import { supabase } from '@/lib/supabase'

// Example usage
const { data, error } = await supabase
  .from('contacts')
  .insert({ name, email, message })
```

### Analytics

Google Analytics is ready to be integrated. Add your tracking ID to the environment variables and implement the tracking in your components.

### Form Handling

Forms use React Hook Form for validation and submission. Example in `src/components/ui/contact-form.tsx`.

## 🚀 Deployment

### Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Use the Next.js preset

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics tracking ID | ❌ |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Application name | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Supabase Documentation](https://supabase.com/docs)