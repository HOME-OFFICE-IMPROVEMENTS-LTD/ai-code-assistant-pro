# AI Code Assistant Pro - Version Control Strategy

## 🎯 Single Source of Truth

**Canonical Version: 1.0.5**
- **Location**: `/home/msalsouri/Projects/ai-code-assistant-pro/ai-code-assistant-pro-1.0.5.vsix`
- **Status**: Production ready with all fixes, newer than marketplace version, fixed connection status
- **Features**: Working buttons, Ollama integration, 10 AI personalities, correct status display

## 📋 Version Management Rules

### 1. Local Development
- ✅ Keep **ONLY** one VSIX file at a time
- ✅ Delete old versions immediately after creating new ones
- ✅ Always update `package.json` version before packaging

### 2. Extension Installation
- ✅ Always uninstall before installing new version
- ✅ Verify clean installation with `find ~/.vscode/extensions -name "*ai-code-assistant-pro*"`
- ✅ Test functionality before committing to new version

### 3. Version Numbering
- **Format**: MAJOR.MINOR.PATCH (e.g., 1.0.3)
- **MAJOR**: Breaking changes or complete rewrites
- **MINOR**: New features, new personalities, major enhancements
- **PATCH**: Bug fixes, small improvements

### 4. Publishing Strategy
- 🎯 **Current Decision**: Use local development only
- 🔒 **Marketplace**: Do not publish until extension is fully stable
- 📦 **VSIX Distribution**: Share VSIX files directly when needed

## 🧹 Cleanup Checklist

### Before Creating New Version:
1. [ ] Delete old VSIX files: `rm ai-code-assistant-pro-*.vsix`
2. [ ] Update version in `package.json`
3. [ ] Run `npm run compile` to check for errors
4. [ ] Create new VSIX: `npx vsce package`
5. [ ] Test install: `code --install-extension ai-code-assistant-pro-X.X.X.vsix`

### After Testing New Version:
1. [ ] Verify all functionality works
2. [ ] Check Ollama integration
3. [ ] Test all AI personalities
4. [ ] Confirm all buttons respond
5. [ ] Update this document if needed

## 🚫 What NOT to Do

- ❌ Never keep multiple VSIX versions
- ❌ Never install from marketplace while developing locally
- ❌ Never publish untested versions
- ❌ Never skip version number increments

## 📁 Current State

**Active Version**: 1.0.5
**Location**: `ai-code-assistant-pro-1.0.5.vsix`
**Installation**: Clean, single version in VS Code
**Status**: ✅ Working with Ollama integration, newer than marketplace (1.0.3), fixed connection status

## 🔄 Future Updates

When making changes:
1. Increment version in `package.json`
2. Follow cleanup checklist above
3. Test thoroughly before committing
4. Update this document

---
*Last Updated: September 20, 2025*
*Status: Version Chaos Resolved ✅*