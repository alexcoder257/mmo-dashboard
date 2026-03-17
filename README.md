# MMO Dashboard

A Next.js dashboard application built with App Router, Edge Runtime, and modern tooling.

## Overview

- **Name**: mmo-dashboard
- **Description**: MMO Dashboard application
- **Version**: 0.1.0
- **License**: MIT
- **Type**: Module

## Requirements

- **Node**: >= 22
- **pnpm**: >= 10
- **npm**: please-use-pnpm
- **yarn**: please-use-pnpm
- **bun**: please-use-pnpm

## Scripts

This project includes several scripts to assist with development:

- `dev`: Start the development server
- `build`: Build the project and perform type checks
- `start`: Start the production server
- `format`: Format code using Prettier
- `lint`: Lint code using ESLint and fix issues
- `type-check`: Perform type checking with TypeScript Compiler
- `check-all`: Run format, lint, and type-check scripts in parallel
- `preinstall`: Ensure only pnpm is used as the package manager
- `prepare`: Prepare Husky for Git hooks
- `precommit`: Run lint-staged and validate branch names before committing

## Getting Started

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd mmo-dashboard
pnpm install
```

## Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # ESLint check + fix
pnpm format     # Prettier format
pnpm check-all  # Run format, lint, and type-check in parallel
```

## Deployment

Deployed to Cloudflare Pages:

```bash
pnpm build:cloudflare   # Build for Cloudflare
pnpm deploy:cloudflare  # Deploy to Cloudflare Pages
```
