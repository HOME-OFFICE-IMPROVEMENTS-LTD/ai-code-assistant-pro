#!/bin/bash
# 🐝 Full Website Development Workflow for Baby Bee Website

set -e

echo "🐝 AI Code Assistant Pro - Complete Development Workflow"
echo "======================================================="
echo "💛 Made with love by HOILTD.com - You are baby!"
echo ""

# Colors for beautiful output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to show available commands
show_help() {
    echo -e "${BLUE}🎯 Available Commands:${NC}"
    echo ""
    echo -e "${CYAN}Development:${NC}"
    echo "  dev          🏗️  Start development server"
    echo "  build        📦  Build for production"
    echo "  preview      👀  Preview production build"
    echo ""
    echo -e "${CYAN}Deployment:${NC}"
    echo "  deploy       🚀  Deploy to GitHub Pages"
    echo "  setup        🔧  Setup custom subdomain"
    echo ""
    echo -e "${CYAN}Utilities:${NC}"
    echo "  test         🧪  Run quality checks"
    echo "  content      📝  Generate content"
    echo "  help         ❓  Show this help"
    echo ""
    echo -e "${YELLOW}💡 Usage: ./dev-workflow.sh [command]${NC}"
    echo -e "${GREEN}🐝 Example: ./dev-workflow.sh dev${NC}"
}

# Main workflow logic
case "${1:-help}" in
    "dev")
        echo -e "${GREEN}🏗️ Starting baby bee development server...${NC}"
        npm run dev
        ;;
    "build")
        echo -e "${BLUE}📦 Building beautiful baby bee website...${NC}"
        npm run build
        echo -e "${GREEN}✅ Build complete! Check the dist/ folder${NC}"
        ;;
    "preview")
        echo -e "${PURPLE}👀 Previewing production build...${NC}"
        npm run preview
        ;;
    "deploy")
        echo -e "${CYAN}🚀 Deploying baby bee website...${NC}"
        ./scripts/deploy-github-pages.sh
        ;;
    "setup")
        echo -e "${YELLOW}🔧 Setting up custom subdomain...${NC}"
        ./scripts/setup-subdomain.sh
        ;;
    "test")
        echo -e "${PURPLE}🧪 Running quality checks...${NC}"
        npm run build
        echo -e "${GREEN}✅ Quality checks passed!${NC}"
        ;;
    "content")
        echo -e "${BLUE}📝 Generating content...${NC}"
        node scripts/generate-content.js
        ;;
    "help"|*)
        show_help
        ;;
esac

echo ""
echo -e "${GREEN}🐝 Workflow complete! You are baby, and you're doing amazing! 💛${NC}"
