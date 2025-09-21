# Installation Guide

## 🚀 Complete Setup (Extension + Local LLM)

### Step 1: Install the Extension

**From VS Code Marketplace (Recommended):**

1. **Open VS Code**
2. **Go to Extensions** (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. **Search** for "AI Code Assistant Pro"
4. **Click Install** on the extension by "hoiltd-com"

**From Command Line:**

```bash
code --install-extension hoiltd-com.ai-code-assistant-pro
```

### Step 2: Set Up Local LLM (Choose One)

#### Option A: Ollama (Recommended for Beginners)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download essential models
ollama pull codellama:7b          # 3.8 GB - Great for code
ollama pull deepseek-coder:6.7b   # 3.8 GB - Excellent analysis
ollama pull mistral:7b            # 4.4 GB - Fast responses
```

#### Option B: LM Studio (User-Friendly GUI)

1. Download from [lmstudio.ai](https://lmstudio.ai)
2. Install and open LM Studio
3. Browse and download models (search for "codellama", "deepseek-coder")
4. Start local server on `http://localhost:1234`

#### Option C: Jan (Privacy-Focused)

1. Download from [jan.ai](https://jan.ai)
2. Install and set up your preferred models
3. Configure API endpoint in extension settings

### Step 3: Configure Extension Settings

**Quick Configuration:**

1. Open VS Code Settings (`Ctrl+,`)
2. Search: "AI Code Pro"
3. Set your preferred models:

```json
{
  "aiCodePro.preferredModels": [
    "deepseek-coder:6.7b",
    "codellama:7b",
    "mistral:7b"
  ],
  "aiCodePro.localLLMEndpoint": "http://localhost:11434",
  "aiCodePro.defaultPersonality": "buzzy"
}
```

### Step 4: Test Your Setup

1. Press `Ctrl+Shift+A` to open AI chat
2. Ask: "How can you help me with my code?"
3. You should see your chosen AI personality respond!

## 🔧 Alternative Installation Methods

### From VSIX File

1. Download the latest `.vsix` file from [Releases](https://github.com/HOME-OFFICE-IMPROVEMENTS-LTD/ai-code-assistant-pro/releases)
2. Open VS Code
3. Press `Ctrl+Shift+P` (`Cmd+Shift+P` on Mac)
4. Type "Extensions: Install from VSIX..."
5. Select the downloaded `.vsix` file

## ⚙️ System Requirements

- **VS Code:** Version 1.85.0 or higher
- **Operating System:** Windows, macOS, or Linux
- **Memory:** 4GB RAM minimum, 8GB recommended
- **Storage:** 100MB free space

## 🔧 First Time Setup

### 1. Verify Installation
- Open Command Palette (`Ctrl+Shift+P`)
- Look for "AI Code Assistant" commands
- You should see all 10 AI personalities available

### 2. Configure Settings
- Go to VS Code Settings (`Ctrl+,`)
- Search for "AI Code Assistant"
- Set your preferred default personality
- Configure privacy and team settings

### 3. Test the Extension
- Open any code file
- Press `Ctrl+Shift+P`
- Run "AI Code Assistant: Open AI Chat"
- Ask Buzzy: "How can I optimize this code?"

## 🛠️ Troubleshooting

### Extension Issues

**Extension Not Loading:**

1. Restart VS Code
2. Check if extension is enabled in Extensions panel
3. Check VS Code version compatibility (requires 1.104.0+)

**Commands Not Appearing:**

1. Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Check for extension updates
3. Verify installation was successful

### LLM Connection Issues

**"No Models Found" Error:**

1. Verify your LLM service is running:

   ```bash
   # For Ollama
   ollama list
   curl http://localhost:11434/api/tags
   ```

2. Check extension settings for correct endpoint
3. Download at least one model: `ollama pull codellama:7b`

**Slow Responses:**

1. Use smaller models (7B instead of 13B)
2. Close other memory-intensive applications
3. Check available RAM (8GB+ recommended)

**Connection Refused:**

1. Verify LLM service is running on correct port
2. Check firewall settings
3. Try different endpoint (LM Studio: `:1234`, Ollama: `:11434`)

### Performance Issues

**High Memory Usage:**

1. Close unnecessary extensions
2. Use lighter models (codellama:7b vs codellama:13b)
3. Increase available system memory

**Slow Code Analysis:**

1. Configure preferred faster models in settings
2. Reduce `maxResponseLength` in settings
3. Use specific personalities for focused tasks

## 🔄 Updates

The extension automatically updates through VS Code's extension system. To manually check for updates:

1. Go to Extensions panel
2. Click the gear icon next to AI Code Assistant Pro
3. Select "Check for Updates"

## 🆘 Getting Help

If you encounter issues:

1. **Check our [FAQ](faq.md)**
2. **Search [GitHub Issues](https://github.com/HOME-OFFICE-IMPROVEMENTS-LTD/ai-code-assistant-pro/issues)**
3. **Create a new issue** with detailed information
4. **Contact support:** [info@hoiltd.com](mailto:info@hoiltd.com)

---

**Need enterprise support?** Contact us at [info@hoiltd.com](mailto:info@hoiltd.com) for professional assistance.
