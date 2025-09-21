export interface LocalLLMModel {
    name: string;
    id: string;
    size: string;
    status: 'available' | 'loading' | 'error';
    capabilities: string[];
}
export interface LLMResponse {
    text: string;
    model: string;
    tokens: number;
    processingTime: number;
}
export interface OllamaModel {
    name: string;
    size?: number | string;
    digest?: string;
    modified_at?: string;
}
export interface OllamaModelsResponse {
    models?: OllamaModel[];
}
export interface LlamaCppModel {
    model: string;
    status: string;
    loaded: boolean;
}
export interface LocalAIModel {
    id: string;
    object: string;
    created?: number;
    owned_by?: string;
}
export interface LocalAIModelsResponse {
    data?: LocalAIModel[];
    object: string;
}
export interface OpenAICompatibleResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    usage?: {
        total_tokens: number;
    };
}
export interface OpenAICompatibleResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    usage?: {
        total_tokens: number;
    };
}
export interface ModelInfo {
    name?: string;
    size?: number;
    digest?: string;
    details?: {
        parent_model?: string;
        format?: string;
        family?: string;
        families?: string[];
        parameter_size?: string;
        quantization_level?: string;
    };
    template?: string;
    modified_at?: string;
}
export interface OptimalConfigAssignment {
    personality: string;
    model: string;
    reason: string;
}
export interface OptimalModelConfiguration {
    assignments?: OptimalConfigAssignment[];
    lastOptimized?: string;
    version?: number;
}
export declare class LocalLLMService {
    private endpoint;
    private availableModels;
    private preferredModels;
    private performanceMonitor;
    constructor();
    private initializeModels;
    discoverModels(): Promise<LocalLLMModel[]>;
    private getModelCapabilities;
    generateResponse(prompt: string, modelPreference?: string, personalityId?: string, taskType?: string): Promise<LLMResponse>;
    private selectBestModel;
    getAvailableModels(): LocalLLMModel[];
    testConnection(): Promise<boolean>;
    getModelInfo(modelId: string): Promise<ModelInfo | null>;
    private calculateResponseQuality;
    private recordPerformanceMetric;
    private validatePersonalityResponse;
    private generatePerfectPersonalityResponse;
    private generateExpertiseBasedResponse;
    private ensureQualityStandards;
    private generateVSCodeSpecificHelp;
    getPerformanceStats(modelId: string): {
        avgResponseTime: number;
        avgQualityScore: number;
        successRate: number;
        totalRequests: number;
        recommendationScore: number;
    };
    getOptimalAssignments(): {
        personalityId: string;
        recommendedModelId: string;
        confidence: number;
    }[];
}
//# sourceMappingURL=local-llm-service.d.ts.map