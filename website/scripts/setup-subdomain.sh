#!/bin/bash
# Setup ai-code-pro.hoiltd.com subdomain

set -e

echo "🏢 Setting up ai-code-pro.hoiltd.com subdomain"
echo "============================================="

# Create CNAME file for custom domain
echo "ai-code-pro.hoiltd.com" > public/CNAME

echo "✅ CNAME file created"
echo "📋 Next steps:"
echo "1. Add DNS CNAME record: ai-code-pro.hoiltd.com -> HOME-OFFICE-IMPROVEMENTS-LTD.github.io"
echo "2. Enable GitHub Pages custom domain in repository settings"
echo "3. Wait for DNS propagation (5-30 minutes)"
echo ""
echo "🌐 Website will be available at: https://ai-code-pro.hoiltd.com"
