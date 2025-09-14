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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerationService = void 0;
const vscode = __importStar(require("vscode"));
class CodeGenerationService {
    constructor(llmService, personalityService) {
        this.llmService = llmService;
        this.personalityService = personalityService;
    }
    async generateCode(personalityId, prompt, language) {
        try {
            const personality = this.personalityService.getPersonality(personalityId);
            if (!personality) {
                throw new Error(`Unknown personality: ${personalityId}`);
            }
            // Enhance prompt with personality context and language
            const enhancedPrompt = this.buildCodeGenerationPrompt(personality, prompt, language);
            // Generate code using local LLM
            const response = await this.llmService.generateResponse(enhancedPrompt, personality.preferredModels[0]);
            // Extract and clean the generated code
            return this.extractCode(response.text);
        }
        catch (error) {
            console.error('Code generation failed:', error);
            throw new Error(`Failed to generate code: ${error}`);
        }
    }
    async askPersonality(personalityId, prompt) {
        try {
            const personality = this.personalityService.getPersonality(personalityId);
            if (!personality) {
                throw new Error(`Unknown personality: ${personalityId}`);
            }
            // Use personality-specific prompt
            const personalityPrompt = this.personalityService.getPersonalityPrompt(personalityId, prompt);
            const response = await this.llmService.generateResponse(personalityPrompt, personality.preferredModels[0]);
            return this.formatPersonalityResponse(personality, response.text);
        }
        catch (error) {
            console.error('Personality query failed:', error);
            throw new Error(`Failed to get response from ${personalityId}: ${error}`);
        }
    }
    async analyzeCode(code, analysisType = 'quality') {
        const personalityMap = {
            'performance': 'buzzy',
            'security': 'guardian',
            'quality': 'scout',
            'architecture': 'builder'
        };
        const personalityId = personalityMap[analysisType];
        const prompt = `Analyze this code for ${analysisType}:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide specific recommendations for improvement.`;
        return this.askPersonality(personalityId, prompt);
    }
    async explainCode(code, detailLevel = 'detailed') {
        const prompts = {
            'basic': 'Explain what this code does in simple terms:',
            'detailed': 'Provide a detailed explanation of this code, including its purpose, logic, and key components:',
            'expert': 'Provide an expert-level analysis of this code, including design patterns, performance implications, and potential improvements:'
        };
        const prompt = `${prompts[detailLevel]}\n\n\`\`\`\n${code}\n\`\`\``;
        return this.askPersonality('scribe', prompt);
    }
    async optimizeCode(code, optimizationType = 'performance') {
        const personalityId = optimizationType === 'readability' ? 'scout' : 'buzzy';
        const prompt = `Optimize this code for ${optimizationType}:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide the optimized version with explanations.`;
        return this.askPersonality(personalityId, prompt);
    }
    async generateTests(code, testFramework) {
        const framework = testFramework || this.detectTestFramework();
        const prompt = `Generate comprehensive unit tests for this code using ${framework}:\n\n\`\`\`\n${code}\n\`\`\`\n\nInclude edge cases and error scenarios.`;
        return this.askPersonality('tester', prompt);
    }
    async generateDocumentation(code, docType = 'inline') {
        const prompts = {
            'inline': 'Add inline comments and documentation to this code:',
            'api': 'Generate API documentation for this code:',
            'readme': 'Generate README documentation for this code:'
        };
        const prompt = `${prompts[docType]}\n\n\`\`\`\n${code}\n\`\`\``;
        return this.askPersonality('scribe', prompt);
    }
    async reviewCode(code) {
        const prompt = `Perform a comprehensive code review of this code:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide feedback on:\n- Code quality\n- Best practices\n- Potential issues\n- Suggestions for improvement`;
        return this.askPersonality('scout', prompt);
    }
    async getBestPersonalityForTask(task, codeType) {
        // Simple AI-based personality recommendation
        const recommended = this.personalityService.getRecommendedPersonality(codeType || '', task);
        return recommended || this.personalityService.getPersonality('scout');
    }
    buildCodeGenerationPrompt(personality, prompt, language) {
        const languageContext = language ? `\nTarget Language: ${language}\n` : '';
        return `${personality.systemPrompt}

${languageContext}
Code Generation Request: ${prompt}

Please generate clean, working code that follows best practices for ${personality.specialty}.
Include brief comments explaining key parts of the code.
Ensure the code is production-ready and follows modern conventions.

Response format:
\`\`\`${language || 'typescript'}
// Generated code here
\`\`\``;
    }
    extractCode(response) {
        // Extract code from markdown code blocks
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)\n```/g;
        const matches = response.match(codeBlockRegex);
        if (matches && matches.length > 0) {
            // Return the first code block, removing the markdown syntax
            return matches[0].replace(/```[\w]*\n/, '').replace(/\n```$/, '');
        }
        // If no code blocks found, return the response as-is (might be plain code)
        return response.trim();
    }
    formatPersonalityResponse(personality, response) {
        return `${personality.emoji} **${personality.name}** (${personality.specialty}):\n\n${response}`;
    }
    detectTestFramework() {
        // Try to detect test framework from workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return 'Jest';
        // Check package.json for test frameworks
        const possibleFrameworks = ['Jest', 'Mocha', 'Jasmine', 'Vitest', 'PyTest', 'JUnit'];
        // For now, default to Jest (most popular)
        return 'Jest';
    }
    detectLanguage() {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            return activeEditor.document.languageId;
        }
        return 'typescript';
    }
    async getPersonalityCapabilities() {
        const personalities = this.personalityService.getAllPersonalities();
        const capabilities = {};
        personalities.forEach(personality => {
            capabilities[personality.id] = {
                name: personality.name,
                emoji: personality.emoji,
                specialty: personality.specialty,
                description: personality.description,
                expertise: personality.expertise,
                interactionStyle: personality.interactionStyle,
                availableActions: this.getPersonalityActions(personality.id)
            };
        });
        return capabilities;
    }
    getPersonalityActions(personalityId) {
        const commonActions = ['ask', 'explain', 'analyze'];
        const specializedActions = {
            'buzzy': ['optimize', 'profile', 'benchmark'],
            'builder': ['design', 'architect', 'refactor'],
            'scout': ['review', 'audit', 'inspect'],
            'guardian': ['secure', 'scan', 'protect'],
            'spark': ['innovate', 'enhance', 'modernize'],
            'scribe': ['document', 'explain', 'guide'],
            'metrics': ['measure', 'analyze', 'report'],
            'flash': ['automate', 'deploy', 'accelerate'],
            'honey': ['store', 'query', 'optimize-data'],
            'tester': ['test', 'validate', 'verify']
        };
        return [...commonActions, ...(specializedActions[personalityId] || [])];
    }
    async generateSmartSuggestions(context) {
        const suggestions = [
            "🤖 Ask any personality for help with your code",
            "⚡ Optimize performance with Buzzy",
            "🔨 Review architecture with Builder",
            "🔍 Analyze code quality with Scout",
            "🛡️ Check security with Guardian",
            "✨ Get creative solutions from Spark",
            "📝 Generate documentation with Scribe",
            "🧪 Create tests with Tester"
        ];
        // TODO: Use AI to generate context-aware suggestions
        return suggestions;
    }
}
exports.CodeGenerationService = CodeGenerationService;
//# sourceMappingURL=code-generation-service.js.map