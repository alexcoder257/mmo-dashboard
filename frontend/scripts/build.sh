#!/bin/bash
# Cloudflare Pages build script

echo "Starting Cloudflare Pages build..."

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build Next.js application
echo "Building Next.js application..."
pnpm build

# Run Cloudflare adapter
echo "Running @cloudflare/next-on-pages..."
npx @cloudflare/next-on-pages@1

echo "Build completed successfully!"
