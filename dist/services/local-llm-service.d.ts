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
    getModelInfo(modelId: string): Promise<any>;
    private calculateResponseQuality;
    private recordPerformanceMetric;
    private validatePersonalityResponse;
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