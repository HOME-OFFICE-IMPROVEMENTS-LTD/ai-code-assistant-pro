#!/bin/bash
# AI Code Assistant Pro - Local Website Preview
# Quick access to the professional website locally

echo "🌐 AI Code Assistant Pro - Local Website Preview"
echo "==============================================="
echo "🏢 Professional website by HOILTD.com"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}✅ Development server is running!${NC}"
echo ""
echo -e "${BLUE}🌐 Local URLs:${NC}"
echo -e "   ${CYAN}➜ Local:   http://localhost:3000/${NC}"
echo -e "   ${CYAN}➜ Network: http://$(hostname -I | awk '{print $1}'):3000/${NC}"
echo ""
echo -e "${PURPLE}🎯 Website Features to Test:${NC}"
echo "   🤖 VS Code.dev integration buttons"
echo "   🐝 Interactive 10-personality AI showcase"
echo "   📊 Customer success portal with real data"
echo "   🏢 HOILTD.com professional branding"
echo "   📱 Mobile-responsive design"
echo ""
echo -e "${GREEN}💡 Pro Tip: Open http://localhost:3000/ in your browser${NC}"
echo ""

# Check if running in DevContainer
if [ "$TERM_PROGRAM" = "vscode" ] || [ -n "$VSCODE_IPC_HOOK_CLI" ]; then
    echo -e "${CYAN}🔧 DevContainer detected - Port 3000 should be auto-forwarded${NC}"
    echo ""
fi

echo "Press Ctrl+C to stop the development server"
echo ""

# Keep the script running to show this info
tail -f /dev/null
