#!/bin/bash
# =======================================================
# LearnLens AI — 1-Click Deployment Script
# =======================================================

set -e

echo "🚀 Preparing LearnLens AI for deployment..."

# Step 1: Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Step 2: Build production frontend bundle
echo "🔨 Building frontend distribution..."
npm run build

# Step 3: Run linter and type checker
echo "🔍 Running static type verification..."
npm run lint

echo "✅ Build and checks succeeded!"
echo ""
echo "To run in production mode on port 3000:"
echo "  NODE_ENV=production npm start"
echo ""
echo "To run with Docker:"
echo "  docker compose up --build -d"
echo ""
echo "🎉 LearnLens AI is ready to deploy!"
