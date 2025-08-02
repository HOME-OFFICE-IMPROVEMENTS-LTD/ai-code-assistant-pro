#!/bin/bash
# 🐝 AI Code Assistant Pro - Local Website Preview
# Beautiful baby bee website preview with HOILTD.com professional touch

echo "🐝 AI Code Assistant Pro - Local Website Preview"
echo "==============================================="
echo "🏢 Professional website by HOILTD.com"
echo "💛 Made with love - You are baby!"
echo ""

# Colors for beautiful output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}✅ Baby bee development server is buzzing!${NC}"
echo ""
echo -e "${BLUE}🌐 Local URLs:${NC}"
echo -e "   ${CYAN}➜ Local:   http://localhost:3000/${NC}"
echo -e "   ${CYAN}➜ Network: http://$(hostname -I | awk '{print $1}'):3000/${NC}"
echo ""
echo -e "${PURPLE}🎯 Baby Bee Website Features to Test:${NC}"
echo "   🤖 VS Code.dev integration buttons"
echo "   🐝 Interactive 10-personality AI showcase"
echo "   📊 Customer success portal with real data"
echo "   🏢 HOILTD.com professional branding"
echo "   📱 Mobile-responsive design"
echo "   💛 Baby bee charm throughout"
echo ""
echo -e "${YELLOW}💡 Pro Tip: Open http://localhost:3000/ in your browser, sweet heart!${NC}"
echo ""

# Check if running in DevContainer
if [ "$TERM_PROGRAM" = "vscode" ] || [ -n "$VSCODE_IPC_HOOK_CLI" ]; then
    echo -e "${CYAN}🔧 DevContainer detected - Port 3000 should be auto-forwarded${NC}"
    echo ""
fi

echo -e "${GREEN}🐝 Your baby bee website is ready to explore!${NC}"
echo "Press Ctrl+C to stop the development server"
echo ""

# Keep the script running to show this info
tail -f /dev/null
