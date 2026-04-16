# AMS Wiki - Deployment Guide

## Overview

This project is configured for automated deployment to Vercel with full shadcn/ui component library integration. The deployment pipeline includes automated builds, linting, and environment variable management.

## Prerequisites

- Node.js 18+ installed locally
- npm installed
- Vercel account (vercel.com)
- GitHub account

## Local Development

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/layr8x/ams-wiki.git
   cd ams-wiki
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Confluence credentials:
   - `VITE_CONFLUENCE_EMAIL`: Your Atlassian email
   - `VITE_CONFLUENCE_TOKEN`: Your API token from https://id.atlassian.com/manage-profile/security/api-tokens

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Vercel Deployment

### Initial Setup

1. **Connect GitHub Repository to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository (layr8x/ams-wiki)
   - Configure project settings:
     - Framework: Vite
     - Build command: `npm run build`
     - Output directory: `dist`

2. **Set Environment Variables in Vercel**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following:
     - `VITE_CONFLUENCE_EMAIL`: Your Atlassian email
     - `VITE_CONFLUENCE_TOKEN`: Your API token
   - These should be available in all environments (Production, Preview, Development)

3. **Configure Deployment Branches**
   - Production deployment: main (disabled in vercel.json)
   - Preview/Development: claude/* branches (enabled)

### Automatic Deployments

The project uses `vercel.json` to configure automatic deployments:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "git": {
    "deploymentEnabled": {
      "main": false,
      "claude/*": true
    }
  }
}
```

**Deploy on push to:**
- Branches matching `claude/*` (e.g., `claude/setup-deployment-shadcn-Kx1RH`)

**Skipped for:**
- `main` branch (controlled merging to production)

### Manual Deployment

To manually deploy a branch to Vercel:

```bash
npm install -g vercel
vercel --prod
```

### Production Deployment

To deploy to production on the main branch:

1. Create a pull request from your feature branch to main
2. After review and approval, merge to main
3. Create a release tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

## GitHub Actions CI/CD

The project includes automated CI/CD via GitHub Actions (`.github/workflows/deploy.yml`):

### Workflow Triggers

- Push to `claude/*` branches
- Pull requests to `claude/*` branches

### Workflow Steps

1. **Checkout code** - Fetch repository
2. **Setup Node.js** - Install Node 18 with npm caching
3. **Install dependencies** - Run `npm ci`
4. **Run linting** - Execute ESLint (non-blocking)
5. **Build project** - Run `npm run build` with environment variables
6. **Deploy to Vercel** - Automatic deployment to Vercel

### Required GitHub Secrets

Configure these secrets in GitHub repository settings:

- `VERCEL_TOKEN` - Token from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - Organization ID from Vercel
- `VERCEL_PROJECT_ID` - Project ID from Vercel
- `VITE_CONFLUENCE_EMAIL` - Atlassian email (optional, can be in Vercel env vars)
- `VITE_CONFLUENCE_TOKEN` - API token (optional, can be in Vercel env vars)

### Getting Vercel Credentials

1. **VERCEL_TOKEN**
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Select appropriate scope
   - Copy the token

2. **VERCEL_ORG_ID & VERCEL_PROJECT_ID**
   - Go to your project on Vercel
   - Go to "Settings"
   - Find "Project ID" and copy it
   - Find "Org ID" in Settings > General

## Component Library

The project includes a comprehensive shadcn/ui component library:

### Available Components

- **Button** - Customizable button with variants
- **Card** - Container component with hover states
- **Badge** - Label component with multiple variants
- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Checkbox** - Checkbox input
- **Radio** - Radio button input
- **Select** - Dropdown select
- **Label** - Form label
- **Dialog** - Modal dialog (Radix UI)
- **Tabs** - Tab navigation (Radix UI)
- **Tooltip** - Tooltip component (Radix UI)
- **ScrollArea** - Scrollable area (Radix UI)
- **Alert** - Alert message component
- **Separator** - Divider line

### Using Components

Import from the component library:

```jsx
import { Button, Input, Dialog, DialogContent } from '@/components/ui'

function MyComponent() {
  return (
    <div>
      <Input placeholder="Enter text" />
      <Button variant="primary">Click me</Button>
    </div>
  )
}
```

## Security

### API Token Management

- **Never commit** `.env.local` or similar files with credentials
- Use `.env.example` as a template
- Store secrets in Vercel environment variables
- Use GitHub secrets for CI/CD pipelines

### Best Practices

1. Rotate API tokens regularly
2. Use the principle of least privilege
3. Monitor API usage and access logs
4. Keep dependencies updated

## Troubleshooting

### Build Failures

1. Check Node version: `node --version` (should be 18+)
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check environment variables in `.env.local`
4. Review build logs in Vercel dashboard

### Deployment Issues

1. Verify Vercel project settings
2. Check environment variables in Vercel dashboard
3. Review GitHub Actions workflow logs
4. Check branch protection rules

### Environment Variables Not Loading

1. Ensure `.env.local` exists locally
2. Verify variable names in Vercel dashboard
3. Check for typos in variable names
4. Redeploy after adding new variables

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues or questions:
1. Check the deployment logs in Vercel or GitHub Actions
2. Review error messages carefully
3. Consult the documentation links above
4. Contact the development team
