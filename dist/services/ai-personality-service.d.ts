export interface AIPersonality {
    id: string;
    name: string;
    emoji: string;
    specialty: string;
    description: string;
    systemPrompt: string;
    preferredModels: string[];
    interactionStyle: 'concise' | 'detailed' | 'conversational' | 'technical';
    expertise: string[];
}
export interface PersonalityStats {
    name: string;
    specialty: string;
    expertiseCount: number;
    interactionStyle: string;
    preferredModels: string[];
}
export declare class AIPersonalityService {
    private personalities;
    constructor();
    private initializePersonalities;
    getPersonality(id: string): AIPersonality | undefined;
    getAllPersonalities(): AIPersonality[];
    getPersonalityBySpecialty(specialty: string): AIPersonality[];
    getPersonalityPrompt(id: string, userPrompt: string): string;
    getRecommendedPersonality(codeType: string, taskType: string): AIPersonality | undefined;
    getPersonalityStats(): {
        [key: string]: PersonalityStats;
    };
}
//# sourceMappingURL=ai-personality-service.d.ts.map