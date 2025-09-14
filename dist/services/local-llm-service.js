"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalLLMService = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
class LocalLLMService {
    constructor() {
        this.availableModels = [];
        this.preferredModels = [];
        this.endpoint = vscode.workspace.getConfiguration('aiCodePro').get('localLLMEndpoint', 'http://localhost:11434');
        this.preferredModels = vscode.workspace.getConfiguration('aiCodePro').get('preferredModels', ['codellama', 'deepseek-coder', 'codegemma']);
        this.initializeModels();
    }
    async initializeModels() {
        try {
            await this.discoverModels();
        }
        catch (error) {
            console.error('Failed to initialize local LLM models:', error);
        }
    }
    async discoverModels() {
        try {
            // Try Ollama API first
            const response = await axios_1.default.get(`${this.endpoint}/api/tags`, { timeout: 5000 });
            this.availableModels = response.data.models?.map((model) => ({
                name: model.name,
                id: model.name,
                size: model.size || 'Unknown',
                status: 'available',
                capabilities: this.getModelCapabilities(model.name)
            })) || [];
            console.log(`🧠 Discovered ${this.availableModels.length} local LLM models`);
            return this.availableModels;
        }
        catch (error) {
            // Fallback: Try LocalAI or other endpoints
            try {
                const localAIResponse = await axios_1.default.get(`${this.endpoint}/v1/models`, { timeout: 5000 });
                this.availableModels = localAIResponse.data.data?.map((model) => ({
                    name: model.id,
                    id: model.id,
                    size: 'Unknown',
                    status: 'available',
                    capabilities: this.getModelCapabilities(model.id)
                })) || [];
                return this.availableModels;
            }
            catch (localAIError) {
                console.error('No local LLM service found:', error);
                vscode.window.showWarningMessage('🤖 No local LLM service detected. Install Ollama or LocalAI to use AI features.', 'Install Ollama', 'Configure Endpoint').then(selection => {
                    if (selection === 'Install Ollama') {
                        vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai'));
                    }
                    else if (selection === 'Configure Endpoint') {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'aiCodePro.localLLMEndpoint');
                    }
                });
                return [];
            }
        }
    }
    getModelCapabilities(modelName) {
        const capabilities = ['text-generation'];
        if (modelName.includes('code') || modelName.includes('coder')) {
            capabilities.push('code-generation', 'code-analysis', 'code-completion');
        }
        if (modelName.includes('instruct') || modelName.includes('chat')) {
            capabilities.push('instruction-following', 'conversation');
        }
        if (modelName.includes('embed')) {
            capabilities.push('embeddings');
        }
        return capabilities;
    }
    async generateResponse(prompt, modelPreference) {
        const startTime = Date.now();
        try {
            // Select best model for the task
            const selectedModel = this.selectBestModel(modelPreference);
            if (!selectedModel) {
                throw new Error('No suitable local LLM model available');
            }
            // Try Ollama format first
            try {
                const response = await axios_1.default.post(`${this.endpoint}/api/generate`, {
                    model: selectedModel.id,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.1,
                        top_p: 0.9,
                        max_tokens: vscode.workspace.getConfiguration('aiCodePro').get('maxResponseLength', 2048)
                    }
                }, { timeout: 30000 });
                const processingTime = Date.now() - startTime;
                return {
                    text: response.data.response || response.data.content || '',
                    model: selectedModel.name,
                    tokens: response.data.eval_count || 0,
                    processingTime
                };
            }
            catch (ollamaError) {
                // Try OpenAI-compatible format (LocalAI, etc.)
                const response = await axios_1.default.post(`${this.endpoint}/v1/chat/completions`, {
                    model: selectedModel.id,
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.1,
                    max_tokens: vscode.workspace.getConfiguration('aiCodePro').get('maxResponseLength', 2048)
                }, { timeout: 30000 });
                const processingTime = Date.now() - startTime;
                return {
                    text: response.data.choices[0].message.content || '',
                    model: selectedModel.name,
                    tokens: response.data.usage?.total_tokens || 0,
                    processingTime
                };
            }
        }
        catch (error) {
            console.error('LLM generation failed:', error);
            throw new Error(`Failed to generate response: ${error}`);
        }
    }
    selectBestModel(preference) {
        if (this.availableModels.length === 0) {
            return null;
        }
        // If specific model requested and available
        if (preference) {
            const preferred = this.availableModels.find(m => m.id === preference || m.name === preference);
            if (preferred)
                return preferred;
        }
        // Try preferred models in order
        for (const preferredModel of this.preferredModels) {
            const model = this.availableModels.find(m => m.id.includes(preferredModel) || m.name.includes(preferredModel));
            if (model)
                return model;
        }
        // Fallback to any available code model
        const codeModel = this.availableModels.find(m => m.capabilities.includes('code-generation'));
        if (codeModel)
            return codeModel;
        // Last resort: any available model
        return this.availableModels[0];
    }
    getAvailableModels() {
        return this.availableModels;
    }
    async testConnection() {
        try {
            const response = await this.generateResponse('Hello! Please respond with just "OK" to test the connection.');
            return response.text.trim().toLowerCase().includes('ok');
        }
        catch (error) {
            return false;
        }
    }
    async getModelInfo(modelId) {
        try {
            // Try Ollama show endpoint
            const response = await axios_1.default.post(`${this.endpoint}/api/show`, {
                name: modelId
            }, { timeout: 5000 });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get model info:', error);
            return null;
        }
    }
}
exports.LocalLLMService = LocalLLMService;
//# sourceMappingURL=local-llm-service.js.map