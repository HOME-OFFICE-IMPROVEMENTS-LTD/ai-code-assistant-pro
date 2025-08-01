#!/bin/bash
# Automated GitHub Pages deployment

set -e

echo "🚀 Deploying AI Code Assistant Pro Website to GitHub Pages"
echo "======================================================="

# Build the website
echo "📦 Building website..."
npm run build

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Website available at: https://HOME-OFFICE-IMPROVEMENTS-LTD.github.io/ai-code-assistant-pro/"
