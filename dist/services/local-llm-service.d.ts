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
    constructor();
    private initializeModels;
    discoverModels(): Promise<LocalLLMModel[]>;
    private getModelCapabilities;
    generateResponse(prompt: string, modelPreference?: string): Promise<LLMResponse>;
    private selectBestModel;
    getAvailableModels(): LocalLLMModel[];
    testConnection(): Promise<boolean>;
    getModelInfo(modelId: string): Promise<any>;
}
//# sourceMappingURL=local-llm-service.d.ts.map