# AI Code Assistant Pro

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=hoiltd-com.ai-code-assistant-pro)
[![Version](https://img.shields.io/badge/version-1.1.2-green)](https://marketplace.visualstudio.com/items?itemName=hoiltd-com.ai-code-assistant-pro)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A VS Code extension with 10 specialized AI personalities that work with your local LLM setup.

## 🚀 Quick Start

### Option 1: Complete Setup (5 minutes)

1. **Install Ollama** (recommended): Download from [ollama.ai](https://ollama.ai)
2. **Download models** via terminal:

   ```bash
   ollama pull codellama:7b      # Great for code generation
   ollama pull deepseek-coder:6.7b  # Excellent for code analysis
   ```

3. **Install this extension** from VS Code marketplace
4. **Start coding** - Press `Ctrl+Shift+A` to open AI chat

### Option 2: Use Your Existing LLM Setup

- **LM Studio**, **Jan**, **LocalAI** - Set your endpoint in settings
- **API Services** - Configure your preferred models in extension settings

### ⚙️ Configure Your Preferred Models

**Via Settings UI:**

1. Open VS Code Settings (`Ctrl+,`)
2. Search: "AI Code Pro"
3. Edit "Preferred Models" - add your model names in order of preference

**Via Settings JSON:**

```json
{
  "aiCodePro.preferredModels": [
    "deepseek-coder:6.7b",
    "codellama:7b",
    "dolphin-mixtral:8x7b"
  ],
  "aiCodePro.localLLMEndpoint": "http://localhost:11434"
}
```

## AI Personalities

Choose the right personality for your task:

**Code Specialists:**

- **CodeMaster** - Complex programming tasks
- **BugHunter** - Debugging and error fixing
- **OptimizeAI** - Performance optimization

**Creative Team:**

- **CreativeGenius** - UI/UX and innovative solutions
- **DocumentationAI** - Technical writing
- **ExperimentalAI** - Latest techniques and frameworks

**Quality & Security:**

- **SecurityGuard** - Security analysis
- **TestMaster** - Testing strategies
- **ReviewMaster** - Code review

**Learning:**

- **TutorAI** - Teaching and explanations

## Model Recommendations

The extension adapts to your models. Here are some popular choices:

**For students/beginners:**

- codellama:7b (lightweight, great for learning)
- mistral:7b (fast responses)

**For professionals:**

- deepseek-coder:6.7b (excellent code analysis)
- dolphin-mixtral:8x7b (advanced reasoning)

See [docs/MODEL_RECOMMENDATIONS.md](docs/MODEL_RECOMMENDATIONS.md) for detailed setup guides.

## Supported Services

- **Ollama** - Simple setup, great for beginners
- **LM Studio** - Nice UI for model management
- **Jan** - Privacy-focused
- **LocalAI** - Custom configurations

## Configuration

Access settings through VS Code: Extensions → AI Code Assistant Pro

Key settings:

- `aiCodePro.preferredModels` - Your preferred model patterns
- `aiCodePro.localLLMEndpoint` - Service URL (usually auto-detected)
- `aiCodePro.defaultPersonality` - Your default AI personality

## Documentation

- [Model Setup Guide](docs/MODEL_RECOMMENDATIONS.md)
- [Installation Instructions](docs/installation.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Support

- [GitHub Issues](https://github.com/HOME-OFFICE-IMPROVEMENTS-LTD/ai-code-assistant-pro/issues)
- Community discussions welcome

## License

MIT License - see [LICENSE](LICENSE) file for details.
