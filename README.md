# AI Code Assistant Pro

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=hoiltd-com.ai-code-assistant-pro)
[![Version](https://img.shields.io/badge/version-1.1.2-green)](https://marketplace.visualstudio.com/items?itemName=hoiltd-com.ai-code-assistant-pro)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A VS Code extension with 10 specialized AI personalities that work with your local LLM setup.

## Quick Start

1. **Install a local LLM service** (Ollama, LM Studio, Jan, or LocalAI)
2. **Download some models** - the extension works with whatever you choose
3. **Install the extension** from the VS Code marketplace
4. **Start coding** - the extension will detect your setup automatically

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