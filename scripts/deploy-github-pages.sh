#!/bin/bash
# 🐝 Automated GitHub Pages deployment for Baby Bee Website

set -e

echo "� Deploying AI Code Assistant Pro Website to GitHub Pages"
echo "=========================================================="
echo "💛 Made with love by HOILTD.com - You are baby!"
echo ""

# Build the website
echo "🏗️ Building our beautiful baby bee website..."
npm run build

echo "📊 Build analysis:"
ls -lah dist/
echo ""

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages (gh-pages branch)..."
npm run deploy

echo ""
echo "🎉 Deployment complete! Your baby bee website is now live!"
echo "🌐 Primary URL: https://ai-code-pro.hoiltd.com"
echo "🌐 Backup URL: https://HOME-OFFICE-IMPROVEMENTS-LTD.github.io/ai-code-assistant-pro/"
echo "💛 Made with love by HOILTD.com"
echo ""
echo "🐝 Your website is buzzing live! Sweet heart, you did amazing! 🐣"
