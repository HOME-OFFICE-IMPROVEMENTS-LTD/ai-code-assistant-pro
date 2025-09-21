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
const performance_monitoring_service_1 = require("./performance-monitoring-service");
class LocalLLMService {
    constructor() {
        this.availableModels = [];
        this.preferredModels = [];
        this.endpoint = vscode.workspace.getConfiguration('aiCodePro').get('localLLMEndpoint', 'http://localhost:11434');
        this.preferredModels = vscode.workspace.getConfiguration('aiCodePro').get('preferredModels', [
            // Smart defaults that work for most users
            'codellama', 'codellama:7b', 'codellama:13b',
            'deepseek-coder', 'deepseek-coder:6.7b', 'deepseek-coder:13b',
            'dolphin-mixtral', 'dolphin-mixtral:8x7b',
            'mistral', 'mistral:7b',
            'codegemma', 'codegemma:7b'
        ]);
        this.performanceMonitor = performance_monitoring_service_1.PerformanceMonitoringService.getInstance();
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
    async generateResponse(prompt, modelPreference, personalityId, taskType) {
        const startTime = Date.now();
        let selectedModel = null;
        let errorOccurred = false;
        try {
            // Select best model for the task
            selectedModel = this.selectBestModel(modelPreference);
            console.log('🔍 Debug: Available models:', this.availableModels.length);
            console.log('🔍 Debug: Model preference:', modelPreference);
            console.log('🔍 Debug: Selected model:', selectedModel);
            if (!selectedModel) {
                console.error('❌ No suitable local LLM model available');
                throw new Error('No suitable local LLM model available');
            }
            // Try Ollama format first
            try {
                const response = await axios_1.default.post(`${this.endpoint}/api/generate`, {
                    model: selectedModel.id,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.01, // Extremely low for maximum consistency
                        top_p: 0.8,
                        repeat_penalty: 1.2,
                        num_predict: vscode.workspace.getConfiguration('aiCodePro').get('maxResponseLength', 2048),
                        stop: ["<|im_end|>"],
                        seed: 42 // Fixed seed for reproducibility
                    }
                }, { timeout: 30000 });
                const processingTime = Date.now() - startTime;
                let responseText = response.data.response || response.data.content || '';
                // Validate and correct personality consistency if needed
                if (personalityId) {
                    responseText = this.validatePersonalityResponse(responseText, personalityId);
                }
                // Record performance metrics
                if (personalityId) {
                    const qualityScore = this.calculateResponseQuality(responseText, prompt);
                    this.recordPerformanceMetric({
                        modelId: selectedModel.id,
                        personalityId,
                        responseTime: processingTime,
                        tokenCount: response.data.eval_count || 0,
                        qualityScore,
                        errorRate: 0,
                        timestamp: new Date(),
                        taskType: taskType || 'general'
                    });
                }
                return {
                    text: responseText,
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
                    temperature: 0.01, // Extremely low for maximum consistency
                    top_p: 0.8,
                    max_tokens: vscode.workspace.getConfiguration('aiCodePro').get('maxResponseLength', 2048),
                    seed: 42 // Fixed seed for reproducibility
                }, { timeout: 30000 });
                const processingTime = Date.now() - startTime;
                let responseText = response.data.choices[0].message.content || '';
                // Validate and correct personality consistency if needed
                if (personalityId) {
                    responseText = this.validatePersonalityResponse(responseText, personalityId);
                }
                // Record performance metrics
                if (personalityId) {
                    const qualityScore = this.calculateResponseQuality(responseText, prompt);
                    this.recordPerformanceMetric({
                        modelId: selectedModel.id,
                        personalityId,
                        responseTime: processingTime,
                        tokenCount: response.data.usage?.total_tokens || 0,
                        qualityScore,
                        errorRate: 0,
                        timestamp: new Date(),
                        taskType: taskType || 'general'
                    });
                }
                return {
                    text: responseText,
                    model: selectedModel.name,
                    tokens: response.data.usage?.total_tokens || 0,
                    processingTime
                };
            }
        }
        catch (error) {
            errorOccurred = true;
            // Record error metrics
            if (selectedModel && personalityId) {
                this.recordPerformanceMetric({
                    modelId: selectedModel.id,
                    personalityId,
                    responseTime: Date.now() - startTime,
                    tokenCount: 0,
                    qualityScore: 0,
                    errorRate: 1,
                    timestamp: new Date(),
                    taskType: taskType || 'general'
                });
            }
            console.error('LLM generation failed:', error);
            throw new Error(`Failed to generate response: ${error}`);
        }
    }
    selectBestModel(preference) {
        if (this.availableModels.length === 0) {
            return null;
        }
        // Check for optimal configuration from Advanced Model Configuration
        const config = vscode.workspace.getConfiguration('aiCodePro');
        const optimalConfig = config.get('optimalModelConfiguration');
        if (optimalConfig?.assignments && preference) {
            // Find assignment for this personality
            const assignment = optimalConfig.assignments.find((a) => preference.includes(a.personalityId) || a.personalityId === preference);
            if (assignment) {
                const assignedModel = this.availableModels.find(m => m.id === assignment.modelId || m.name === assignment.modelId);
                if (assignedModel) {
                    console.log(`🎯 Using optimal assignment: ${assignedModel.name} for ${preference}`);
                    return assignedModel;
                }
            }
        }
        // If specific model requested and available
        if (preference) {
            const preferred = this.availableModels.find(m => m.id === preference || m.name === preference);
            if (preferred) {
                return preferred;
            }
        }
        // Try preferred models in order
        for (const preferredModel of this.preferredModels) {
            const model = this.availableModels.find(m => m.id.includes(preferredModel) || m.name.includes(preferredModel));
            if (model) {
                return model;
            }
        }
        // Fallback to any available code model
        const codeModel = this.availableModels.find(m => m.capabilities.includes('code-generation'));
        if (codeModel) {
            return codeModel;
        }
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
    calculateResponseQuality(response, prompt) {
        // Auto-score response quality based on various factors
        let score = 0.5; // Base score
        // Length appropriateness (not too short, not too long)
        if (response.length > 50 && response.length < 2000)
            score += 0.1;
        // Code detection
        if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('function')) {
            if (response.includes('```') || response.includes('def ') || response.includes('function')) {
                score += 0.2;
            }
        }
        // Completeness (response seems complete)
        if (!response.trim().endsWith('...') && response.length > 30)
            score += 0.1;
        // Relevance (contains key terms from prompt)
        const promptWords = prompt.toLowerCase().split(' ').filter(w => w.length > 3);
        const responseWords = response.toLowerCase().split(' ');
        let relevanceHits = 0;
        for (const word of promptWords) {
            if (responseWords.some(rw => rw.includes(word) || word.includes(rw))) {
                relevanceHits++;
            }
        }
        if (promptWords.length > 0) {
            score += (relevanceHits / promptWords.length) * 0.1;
        }
        return Math.min(score, 1.0);
    }
    recordPerformanceMetric(metric) {
        this.performanceMonitor.recordMetric(metric);
    }
    validatePersonalityResponse(response, personalityId) {
        // Import personality service to get personality details
        const { AIPersonalityService } = require('./ai-personality-service');
        const personalityService = new AIPersonalityService();
        const personality = personalityService.getPersonality(personalityId);
        if (!personality) {
            return response;
        }
        const expectedGreeting = `Hello! I'm ${personality.name}, your professional ${personality.specialty} specialist.`;
        // Check if response starts with the correct greeting
        if (!response.startsWith(expectedGreeting)) {
            console.log(`🔧 Correcting personality response for ${personality.name}`);
            // Extract the actual content after any incorrect greeting
            let cleanedResponse = response;
            // Remove common incorrect greetings
            const incorrectPatterns = [
                /^Hello!? I'm an AI.*/i,
                /^I'm an AI model.*/i,
                /^As an AI.*/i,
                /^I am an AI.*/i,
                /^Hello!? I'm.*/i
            ];
            for (const pattern of incorrectPatterns) {
                cleanedResponse = cleanedResponse.replace(pattern, '');
            }
            // Remove leading whitespace and get to the actual content
            cleanedResponse = cleanedResponse.trim();
            // If there's remaining content, prepend the correct greeting
            if (cleanedResponse) {
                return `${expectedGreeting} ${cleanedResponse}`;
            }
            else {
                // If response was entirely wrong, provide a basic correct response
                return `${expectedGreeting} I can help you with ${personality.specialty.toLowerCase()} related questions and tasks. What would you like assistance with?`;
            }
        }
        return response;
    }
    getPerformanceStats(modelId) {
        return this.performanceMonitor.getModelStats(modelId);
    }
    getOptimalAssignments() {
        return this.performanceMonitor.getOptimalAssignments();
    }
}
exports.LocalLLMService = LocalLLMService;
//# sourceMappingURL=local-llm-service.js.map