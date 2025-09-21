# 🎯 AI Code Assistant Pro - Model Recommendations for Users

## 🚀 Quick Start - Choose Your Profile

### 👨‍🎓 **Students & Beginners** (4-8 GB RAM)
**Recommended Setup:**
```bash
ollama pull codellama:7b     # 3.8 GB - Best for learning code
ollama pull mistral:7b       # 4.4 GB - Fast responses
```
**Why:** Lightweight, fast responses, perfect for learning and basic coding tasks.

### 💼 **Professional Developers** (16+ GB RAM)
**Recommended Setup:**
```bash
ollama pull deepseek-coder:6.7b    # 3.8 GB - Superior code analysis
ollama pull codellama:7b            # 3.8 GB - Code generation
ollama pull dolphin-mixtral:8x7b    # 26 GB - Advanced reasoning
```
**Why:** Best balance of performance and capability for professional work.

### 🏢 **Enterprise Teams** (32+ GB RAM)
**Recommended Setup:**
```bash
ollama pull deepseek-coder:13b      # 7.3 GB - Enterprise code quality
ollama pull codellama:13b           # 7.3 GB - Large-scale projects
ollama pull dolphin-mixtral:8x7b    # 26 GB - Complex architecture
ollama pull mistral:7b              # 4.4 GB - Fast iterations
```
**Why:** Maximum capability for complex enterprise development.

## 🎯 Personality → Model Mapping

### **Code-Focused Personalities**
- ⚡ **Buzzy** (Performance) → `deepseek-coder` > `codellama`
- 🔍 **Scout** (Code Quality) → `deepseek-coder` > `codellama`  
- 🛡️ **Guardian** (Security) → `deepseek-coder` > `codellama`
- ⚡ **Flash** (Speed) → `codellama` > `deepseek-coder`
- 🍯 **Honey** (Memory) → `deepseek-coder` > `codellama`
- 🧪 **Tester** (QA) → `codellama` > `deepseek-coder`

### **Analysis & Creative Personalities**
- 🔨 **Builder** (Architecture) → `dolphin-mixtral` > `mistral`
- ✨ **Spark** (Innovation) → `dolphin-mixtral` > `mistral`
- 📝 **Scribe** (Documentation) → `dolphin-mixtral` > `mistral`
- 📊 **Metrics** (Analytics) → `dolphin-mixtral` > `mistral`

## ⚙️ How to Configure Your Preferences

### **Method 1: VS Code Settings UI**
1. Open VS Code Settings (`Ctrl+,`)
2. Search for "AI Code Pro"
3. Edit "Preferred Models" list
4. Add your installed models in order of preference

### **Method 2: Settings JSON**
```json
{
  "aiCodePro.preferredModels": [
    "deepseek-coder:6.7b",
    "codellama:7b", 
    "dolphin-mixtral:8x7b",
    "mistral:7b"
  ],
  "aiCodePro.localLLMEndpoint": "http://localhost:11434",
  "aiCodePro.defaultPersonality": "buzzy"
}
```

## 📊 Model Performance Comparison

| Model | Size | Speed | Code Quality | Reasoning | Best For |
|-------|------|--------|--------------|-----------|----------|
| `mistral:7b` | 4.4 GB | ⚡⚡⚡ | ⭐⭐⭐ | ⭐⭐⭐ | Students, Quick responses |
| `codellama:7b` | 3.8 GB | ⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐ | General coding |
| `deepseek-coder:6.7b` | 3.8 GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Professional coding |
| `dolphin-mixtral:8x7b` | 26 GB | ⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Complex analysis |

## 🔧 Troubleshooting

### **No Models Found**
1. Install Ollama: https://ollama.ai
2. Download at least one model: `ollama pull codellama:7b`
3. Restart VS Code

### **Slow Responses**
- Use smaller models (7B instead of 13B)
- Close other applications to free RAM
- Check GPU availability with `ollama ps`

### **Poor Code Quality**
- Prioritize `deepseek-coder` models in settings
- Use specific personalities for tasks (Scout for reviews, Guardian for security)

## 💡 Pro Tips

1. **Start Small**: Begin with `codellama:7b` and `mistral:7b`
2. **Add Gradually**: Download larger models as you need more capability
3. **Mix & Match**: Different models excel at different tasks
4. **Monitor Usage**: Check Task Manager/Activity Monitor for RAM usage
5. **Regular Updates**: Keep models updated with `ollama pull <model>`

## 🎯 Quick Installation Commands

### **Minimal Setup (Students)**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull codellama:7b
ollama pull mistral:7b
```

### **Professional Setup**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull deepseek-coder:6.7b
ollama pull codellama:7b
ollama pull dolphin-mixtral:8x7b
```

### **Enterprise Setup**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull deepseek-coder:13b
ollama pull codellama:13b
ollama pull dolphin-mixtral:8x7b
ollama pull mistral:7b
```

---
**Need Help?** The extension will automatically detect your installed models and guide you to the best setup for your needs!