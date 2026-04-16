# AMS Wiki

A modern React application built with Vite and shadcn/ui components, featuring automatic deployment to Vercel.

## Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Components**: Radix UI primitives
- **Routing**: React Router v7
- **State Management**: React Query
- **Deployment**: Vercel with GitHub Actions CI/CD

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Confluence credentials

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Features

- ✅ Full shadcn/ui component library (15+ components)
- ✅ Responsive design with Tailwind CSS
- ✅ Automated deployment to Vercel
- ✅ GitHub Actions CI/CD pipeline
- ✅ Environment variable management
- ✅ ESLint configuration

## Deployment

### Automatic Deployments

- **Preview**: Deployments on push to `claude/*` branches
- **Production**: Manual deployments to main branch

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Environment Setup

Required environment variables:
- `VITE_CONFLUENCE_EMAIL` - Atlassian email
- `VITE_CONFLUENCE_TOKEN` - API token from [Atlassian](https://id.atlassian.com/manage-profile/security/api-tokens)

## Component Library

Complete shadcn/ui component library included:
- Button, Badge, Card
- Input, Textarea, Select, Checkbox, Radio
- Dialog, Tabs, Tooltip, Alert
- ScrollArea, Separator, Label

Import from `@/components/ui`:

```jsx
import { Button, Input, Card } from '@/components/ui'
```

## Project Links

- [Live Demo](https://ams-wiki.vercel.app)
- [Vercel Dashboard](https://vercel.com/layr8xs-projects/ams-wiki)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Getting Help

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- See [ESLint docs](https://eslint.org) for linting rules
- Review [Vite docs](https://vitejs.dev) for build configuration
