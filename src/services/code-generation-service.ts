import * as vscode from 'vscode';
import { LocalLLMService } from './local-llm-service';
import { AIPersonalityService, AIPersonality } from './ai-personality-service';

export interface CodeGenerationRequest {
    prompt: string;
    personality?: string;
    language?: string;
    context?: string;
    maxLength?: number;
}

export interface CodeGenerationResponse {
    code: string;
    explanation: string;
    personality: string;
    language: string;
    confidence: number;
    suggestions: string[];
}

export class CodeGenerationService {
    constructor(
        private llmService: LocalLLMService,
        private personalityService: AIPersonalityService
    ) {}

    async generateCode(personalityId: string, prompt: string, language?: string): Promise<string> {
        try {
            const personality = this.personalityService.getPersonality(personalityId);
            if (!personality) {
                throw new Error(`Unknown personality: ${personalityId}`);
            }

            // Enhance prompt with personality context and language
            const enhancedPrompt = this.buildCodeGenerationPrompt(personality, prompt, language);
            
            // Generate code using local LLM
            const response = await this.llmService.generateResponse(
                enhancedPrompt, 
                personality.preferredModels[0]
            );

            // Extract and clean the generated code
            return this.extractCode(response.text);

        } catch (error) {
            console.error('Code generation failed:', error);
            throw new Error(`Failed to generate code: ${error}`);
        }
    }

    async askPersonality(personalityId: string, prompt: string): Promise<string> {
        try {
            const personality = this.personalityService.getPersonality(personalityId);
            if (!personality) {
                throw new Error(`Unknown personality: ${personalityId}`);
            }

            // Use personality-specific prompt
            const personalityPrompt = this.personalityService.getPersonalityPrompt(personalityId, prompt);
            
            const response = await this.llmService.generateResponse(
                personalityPrompt,
                personality.preferredModels[0]
            );

            return this.formatPersonalityResponse(personality, response.text);

        } catch (error) {
            console.error('Personality query failed:', error);
            throw new Error(`Failed to get response from ${personalityId}: ${error}`);
        }
    }

    async analyzeCode(code: string, analysisType: 'performance' | 'security' | 'quality' | 'architecture' = 'quality'): Promise<string> {
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

    async explainCode(code: string, detailLevel: 'basic' | 'detailed' | 'expert' = 'detailed'): Promise<string> {
        const prompts = {
            'basic': 'Explain what this code does in simple terms:',
            'detailed': 'Provide a detailed explanation of this code, including its purpose, logic, and key components:',
            'expert': 'Provide an expert-level analysis of this code, including design patterns, performance implications, and potential improvements:'
        };

        const prompt = `${prompts[detailLevel]}\n\n\`\`\`\n${code}\n\`\`\``;
        return this.askPersonality('scribe', prompt);
    }

    async optimizeCode(code: string, optimizationType: 'performance' | 'memory' | 'readability' = 'performance'): Promise<string> {
        const personalityId = optimizationType === 'readability' ? 'scout' : 'buzzy';
        const prompt = `Optimize this code for ${optimizationType}:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide the optimized version with explanations.`;

        return this.askPersonality(personalityId, prompt);
    }

    async generateTests(code: string, testFramework?: string): Promise<string> {
        const framework = testFramework || this.detectTestFramework();
        const prompt = `Generate comprehensive unit tests for this code using ${framework}:\n\n\`\`\`\n${code}\n\`\`\`\n\nInclude edge cases and error scenarios.`;

        return this.askPersonality('tester', prompt);
    }

    async generateDocumentation(code: string, docType: 'inline' | 'api' | 'readme' = 'inline'): Promise<string> {
        const prompts = {
            'inline': 'Add inline comments and documentation to this code:',
            'api': 'Generate API documentation for this code:',
            'readme': 'Generate README documentation for this code:'
        };

        const prompt = `${prompts[docType]}\n\n\`\`\`\n${code}\n\`\`\``;
        return this.askPersonality('scribe', prompt);
    }

    async reviewCode(code: string): Promise<string> {
        const prompt = `Perform a comprehensive code review of this code:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide feedback on:\n- Code quality\n- Best practices\n- Potential issues\n- Suggestions for improvement`;

        return this.askPersonality('scout', prompt);
    }

    async getBestPersonalityForTask(task: string, codeType?: string): Promise<AIPersonality> {
        // Simple AI-based personality recommendation
        const recommended = this.personalityService.getRecommendedPersonality(codeType || '', task);
        return recommended || this.personalityService.getPersonality('scout')!;
    }

    private buildCodeGenerationPrompt(personality: AIPersonality, prompt: string, language?: string): string {
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

    private extractCode(response: string): string {
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

    private formatPersonalityResponse(personality: AIPersonality, response: string): string {
        return `${personality.emoji} **${personality.name}** (${personality.specialty}):\n\n${response}`;
    }

    private detectTestFramework(): string {
        // Try to detect test framework from workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {return 'Jest';}

        // For now, default to Jest (most popular)
        // TODO: Check package.json for test frameworks like Jest, Mocha, Jasmine, Vitest, PyTest, JUnit
        return 'Jest';
    }

    private detectLanguage(): string {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            return activeEditor.document.languageId;
        }
        return 'typescript';
    }

    async getPersonalityCapabilities(): Promise<{ [key: string]: any }> {
        const personalities = this.personalityService.getAllPersonalities();
        const capabilities: { [key: string]: any } = {};

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

    private getPersonalityActions(personalityId: string): string[] {
        const commonActions = ['ask', 'explain', 'analyze'];
        
        const specializedActions: { [key: string]: string[] } = {
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

    async generateSmartSuggestions(): Promise<string[]> {
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
