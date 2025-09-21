import { AIPersonalityService } from '../../src/services/ai-personality-service';

describe('AIPersonalityService', () => {
    let service: AIPersonalityService;

    beforeEach(() => {
        service = new AIPersonalityService();
    });

    describe('getAllPersonalities', () => {
        it('should return all 10 personalities', () => {
            const personalities = service.getAllPersonalities();
            expect(personalities).toHaveLength(10);
        });

        it('should include the core personalities', () => {
            const personalities = service.getAllPersonalities();
            const personalityIds = personalities.map(p => p.id);
            
            expect(personalityIds).toContain('buzzy');
            expect(personalityIds).toContain('builder');
            expect(personalityIds).toContain('scout');
            expect(personalityIds).toContain('guardian');
            expect(personalityIds).toContain('spark');
        });
    });

    describe('getPersonality', () => {
        it('should return the correct personality by id', () => {
            const buzzy = service.getPersonality('buzzy');
            
            expect(buzzy).toBeDefined();
            expect(buzzy?.name).toBe('Buzzy');
            expect(buzzy?.specialty).toBe('Performance Optimization');
        });

        it('should return undefined for invalid id', () => {
            const invalid = service.getPersonality('nonexistent');
            expect(invalid).toBeUndefined();
        });
    });

    describe('getPersonalityPrompt', () => {
        it('should return a properly formatted prompt for valid personality', () => {
            const prompt = service.getPersonalityPrompt('buzzy', 'Test prompt');
            
            expect(prompt).toContain('Hello! I\'m Buzzy, your professional Performance Optimization specialist');
            expect(prompt).toContain('CRITICAL IDENTITY ENFORCEMENT');
            expect(prompt).toContain('Test prompt');
        });

        it('should return default prompt for invalid personality', () => {
            const prompt = service.getPersonalityPrompt('invalid', 'Test prompt');
            
            expect(prompt).toBe('Test prompt');
        });
    });

    describe('personality data integrity', () => {
        it('should have valid data for all personalities', () => {
            const personalities = service.getAllPersonalities();
            
            personalities.forEach(personality => {
                expect(personality.id).toBeTruthy();
                expect(personality.name).toBeTruthy();
                expect(personality.specialty).toBeTruthy();
                expect(personality.description).toBeTruthy();
                expect(personality.expertise).toBeInstanceOf(Array);
                expect(personality.expertise.length).toBeGreaterThan(0);
                expect(personality.systemPrompt).toBeTruthy();
                expect(personality.preferredModels).toBeInstanceOf(Array);
            });
        });

        it('should have unique IDs for all personalities', () => {
            const personalities = service.getAllPersonalities();
            const ids = personalities.map(p => p.id);
            const uniqueIds = new Set(ids);
            
            expect(uniqueIds.size).toBe(personalities.length);
        });

        it('should have unique names for all personalities', () => {
            const personalities = service.getAllPersonalities();
            const names = personalities.map(p => p.name);
            const uniqueNames = new Set(names);
            
            expect(uniqueNames.size).toBe(personalities.length);
        });
    });
});