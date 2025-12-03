# CLAUDE.md

This repository contains the website, documentation and changelog of the software Langfuse (https://langfuse.com).

## Development Commands

### Core Development

- `pnpm dev` - Start development server on localhost:3333
- `pnpm build` - Build the production version
- `pnpm start` - Start production server on localhost:3333

### Content Management

- `pnpm run prebuild` - Updates GitHub stars and generates contributor data (runs automatically before build)
- `bash scripts/update_cookbook_docs.sh` - Convert Jupyter notebooks to markdown (uses uv with inline dependencies)
- `pnpm run link-check` - Check for broken links in documentation

### Analysis

- `pnpm run analyze` - Analyze bundle size using @next/bundle-analyzer

## Architecture Overview

This is a **Nextra-based documentation site** for Langfuse built with Next.js. Key architectural components:

### Technology Stack

- **Nextra** (3.0.15) - Documentation framework built on Next.js
- **Next.js** (15.2.4) - React framework
- **shadcn/ui** - UI component library with semantic color tokens
- **Tailwind CSS** - Styling (always use semantic color tokens, never explicit colors)
- **TypeScript** - Type safety
- **pnpm** - Package manager (v9.5.0)

### Content Architecture

- **MDX/Markdown Pages**: `/pages/` - All documentation content
- **Components**: `/components/` - React components including custom MDX components
- **Cookbook**: `/cookbook/` - Jupyter notebooks converted to markdown
- **Static Assets**: `/public/` - Images, icons, and other static files

### Key Directories

- `components/` - Reusable React components
- `pages/` - All site pages (docs, blog, changelog, FAQ)
- `cookbook/` - Jupyter notebooks (Python/JS) that get converted to markdown
- `components-mdx/` - MDX components used across pages
- `scripts/` - Build and maintenance scripts
- `lib/` - Utility functions and configurations

### Content Management Workflow

1. **Jupyter Notebooks**: Edit `.ipynb` files in `/cookbook/`
2. **Conversion**: Run `bash scripts/update_cookbook_docs.sh` to convert to markdown (uses uv automatically)
3. **Location**: Generated markdown files are placed in `/pages/guides/cookbook/`
4. **Important**: Never edit generated `.md` files directly - always edit the source notebooks

### Key Configuration Files

- `next.config.mjs` - Next.js configuration with extensive redirects
- `theme.config.tsx` - Nextra theme configuration
- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Styling Guidelines

- Use semantic color tokens from shadcn/ui, never explicit colors
- Components follow shadcn/ui patterns and conventions
- Responsive design with mobile-first approach

### Content Types

- **Documentation**: `/pages/docs/` - Technical documentation
- **Blog**: `/pages/blog/` - Blog posts with MDX
- **Changelog**: `/pages/changelog/` - Product updates
- **Cookbook**: `/pages/guides/cookbook/` - Generated from Jupyter notebooks
- **FAQ**: `/pages/faq/` - Frequently asked questions

### Development Notes

- Development server runs on port 3333 (not standard 3000)
- Requires Node.js 22
- Uses pnpm as package manager
- Auto-generates contributor data and GitHub stars before builds
- Extensive redirect configuration for URL management
- CSP headers configured for security in production
- # How to succeed on the Super Day

- For all interviews, you're in the driver's seat. You take ownerhip over product areas in Langfuse, therefore, you need to lead the discussion to get to an outcome with which you can proceed to make our users happy.
- Be ready to dive deep on technical details of the RFC or the code that you will produce during the Super Day.
- Ask questions to clarify product requirements and user needs
- Ask questions on anything technical where you may lack knowledge. All of us do not know everything.
- Work with us to refine the engineering specs
- Discuss trade-offs and defend your technical choices




@pages/handbook/ 
@pages/handbook/how-we-hire/engineering-super-day.mdx 


Please look at the handbook and understand how we like to work. IMO we can do a better job on describing how to succeed on the super day. Please suggest an improved version


ultrathink