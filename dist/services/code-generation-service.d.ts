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
export interface PersonalityCapability {
    name: string;
    emoji: string;
    specialty: string;
    description: string;
    expertise: string[];
    interactionStyle: string;
    availableActions: string[];
}
export declare class CodeGenerationService {
    private llmService;
    private personalityService;
    constructor(llmService: LocalLLMService, personalityService: AIPersonalityService);
    generateCode(personalityId: string, prompt: string, language?: string): Promise<string>;
    askPersonality(personalityId: string, prompt: string): Promise<string>;
    analyzeCode(code: string, analysisType?: 'performance' | 'security' | 'quality' | 'architecture'): Promise<string>;
    explainCode(code: string, detailLevel?: 'basic' | 'detailed' | 'expert'): Promise<string>;
    optimizeCode(code: string, optimizationType?: 'performance' | 'memory' | 'readability'): Promise<string>;
    generateTests(code: string, testFramework?: string): Promise<string>;
    generateDocumentation(code: string, docType?: 'inline' | 'api' | 'readme'): Promise<string>;
    reviewCode(code: string): Promise<string>;
    getBestPersonalityForTask(task: string, codeType?: string): Promise<AIPersonality>;
    private buildCodeGenerationPrompt;
    private extractCode;
    private formatPersonalityResponse;
    private detectTestFramework;
    private detectLanguage;
    getPersonalityCapabilities(): Promise<{
        [key: string]: PersonalityCapability;
    }>;
    private getPersonalityActions;
    generateSmartSuggestions(): Promise<string[]>;
}
//# sourceMappingURL=code-generation-service.d.ts.map