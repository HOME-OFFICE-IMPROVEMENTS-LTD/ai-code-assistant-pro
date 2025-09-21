# Configuration Guide

## 🎯 Essential Settings

### Basic Configuration

Open VS Code Settings (`Ctrl+,`) and search for "AI Code Pro" to access these key settings:

#### **Preferred Models** (Most Important)
```json
{
  "aiCodePro.preferredModels": [
    "deepseek-coder:6.7b",
    "codellama:7b",
    "dolphin-mixtral:8x7b",
    "mistral:7b"
  ]
}
```

List your installed models in order of preference. The extension will automatically choose the best available model for each task.

#### **Local LLM Endpoint**
```json
{
  "aiCodePro.localLLMEndpoint": "http://localhost:11434"
}
```

- **Ollama**: `http://localhost:11434` (default)
- **LM Studio**: `http://localhost:1234`
- **LocalAI**: `http://localhost:8080`
- **Jan**: Check your Jan settings for port

#### **Default Personality**
```json
{
  "aiCodePro.defaultPersonality": "buzzy"
}
```

Choose your favorite AI personality:
- `buzzy` - Performance optimization
- `builder` - Software architecture
- `scout` - Code analysis
- `guardian` - Security
- `spark` - Innovation
- `scribe` - Documentation
- `metrics` - Analytics
- `flash` - Speed
- `honey` - Memory management
- `tester` - Quality assurance

## 🔧 Advanced Configuration

### Performance Settings

```json
{
  "aiCodePro.maxResponseLength": 2048,
  "aiCodePro.enableCodeSuggestions": true,
  "aiCodePro.autoExplainOnSelect": false
}
```

- **maxResponseLength**: Longer responses = more detail, slower performance
- **enableCodeSuggestions**: Real-time code help (may impact performance)
- **autoExplainOnSelect**: Automatic explanations when selecting code

### Privacy Settings

```json
{
  "aiCodePro.privacyMode": "strict",
  "aiCodePro.enableOfflineMode": true
}
```

- **strict**: Maximum privacy, minimal data processing
- **moderate**: Balance between features and privacy
- **relaxed**: Full features enabled
- **enableOfflineMode**: Work completely offline (recommended)

### Advanced Model Configuration

```json
{
  "aiCodePro.optimalModelConfiguration": {
    "temperature": 0.3,
    "maxTokens": 2048,
    "topP": 0.9
  }
}
```

Usually auto-configured by the extension, but you can customize:
- **temperature**: 0.1-1.0 (lower = more focused, higher = more creative)
- **maxTokens**: Response length limit
- **topP**: Response diversity (0.1-1.0)

## 📋 Configuration Examples

### For Students/Beginners

```json
{
  "aiCodePro.preferredModels": ["codellama:7b", "mistral:7b"],
  "aiCodePro.defaultPersonality": "buzzy",
  "aiCodePro.maxResponseLength": 1024,
  "aiCodePro.privacyMode": "strict",
  "aiCodePro.autoExplainOnSelect": true
}
```

### For Professional Developers

```json
{
  "aiCodePro.preferredModels": [
    "deepseek-coder:6.7b",
    "codellama:7b",
    "dolphin-mixtral:8x7b"
  ],
  "aiCodePro.defaultPersonality": "scout",
  "aiCodePro.maxResponseLength": 2048,
  "aiCodePro.privacyMode": "moderate",
  "aiCodePro.enableCodeSuggestions": true
}
```

### For Enterprise Teams

```json
{
  "aiCodePro.preferredModels": [
    "deepseek-coder:13b",
    "codellama:13b",
    "dolphin-mixtral:8x7b",
    "deepseek-coder:6.7b"
  ],
  "aiCodePro.defaultPersonality": "guardian",
  "aiCodePro.maxResponseLength": 4096,
  "aiCodePro.privacyMode": "strict",
  "aiCodePro.enableOfflineMode": true
}
```

## 🚀 Quick Setup Commands

### Access Extension Settings
- **Settings UI**: `Ctrl+,` → Search "AI Code Pro"
- **Command Palette**: `Ctrl+Shift+P` → "AI Code Assistant: Settings"
- **Extension Panel**: Click gear icon next to extension

### Test Your Configuration
1. Press `Ctrl+Shift+A` to open AI chat
2. Ask: "What models are you using?"
3. Verify your preferred models are being used

### Reset to Defaults
If something goes wrong, reset all settings:

```json
{
  "aiCodePro.preferredModels": ["codellama", "deepseek-coder", "mistral"],
  "aiCodePro.localLLMEndpoint": "http://localhost:11434",
  "aiCodePro.defaultPersonality": "buzzy",
  "aiCodePro.maxResponseLength": 2048,
  "aiCodePro.enableCodeSuggestions": true,
  "aiCodePro.autoExplainOnSelect": false,
  "aiCodePro.enableOfflineMode": true,
  "aiCodePro.privacyMode": "strict"
}
```

## 💡 Pro Tips

1. **Model Order Matters**: List your best models first in `preferredModels`
2. **Match Your Hardware**: Use 7B models for 8GB RAM, 13B for 16GB+
3. **Test Different Personalities**: Each has unique strengths for different tasks
4. **Monitor Performance**: Use smaller models if responses are too slow
5. **Privacy First**: Keep `enableOfflineMode: true` for maximum security

## 🔍 Troubleshooting Configuration

### Models Not Detected
```bash
# Check if models are installed (Ollama)
ollama list

# Test API connection
curl http://localhost:11434/api/tags
```

### Wrong Model Being Used
1. Check your `preferredModels` order
2. Verify model names match exactly (case-sensitive)
3. Ensure models are actually running

### Settings Not Applying
1. Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Check for JSON syntax errors in settings
3. Reset to defaults and reconfigure gradually

---

**Need more help?** Check our [Model Recommendations](MODEL_RECOMMENDATIONS.md) guide for detailed setup instructions.