import * as vscode from 'vscode';

export interface PerformanceMetric {
    modelId: string;
    personalityId: string;
    responseTime: number;
    tokenCount: number;
    qualityScore: number;
    errorRate: number;
    timestamp: Date;
    taskType: string;
}

export interface ModelHealthStatus {
    modelId: string;
    isHealthy: boolean;
    avgResponseTime: number;
    successRate: number;
    lastHealthCheck: Date;
    recommendationScore: number;
}

export class PerformanceMonitoringService {
    private static instance: PerformanceMonitoringService;
    private metrics: PerformanceMetric[] = [];
    private healthStatus: Map<string, ModelHealthStatus> = new Map();
    private monitoringEnabled: boolean = true;
    private readonly maxMetrics = 1000; // Keep last 1000 metrics

    public static getInstance(): PerformanceMonitoringService {
        if (!PerformanceMonitoringService.instance) {
            PerformanceMonitoringService.instance = new PerformanceMonitoringService();
        }
        return PerformanceMonitoringService.instance;
    }

    private constructor() {
        this.loadStoredMetrics();
        this.startPeriodicHealthChecks();
    }

    /**
     * Record performance metric for a model-personality interaction
     */
    recordMetric(metric: PerformanceMetric): void {
        if (!this.monitoringEnabled) {return;}

        this.metrics.push(metric);
        
        // Keep only the most recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Update health status
        this.updateModelHealth(metric);
        
        // Auto-save metrics periodically
        if (this.metrics.length % 10 === 0) {
            this.saveMetrics();
        }

        console.log(`📊 Performance recorded: ${metric.modelId} - ${metric.responseTime}ms`);
    }

    /**
     * Get performance metrics for a specific model
     */
    getModelMetrics(modelId: string): PerformanceMetric[] {
        return this.metrics.filter(m => m.modelId === modelId);
    }

    /**
     * Get performance metrics for a specific personality
     */
    getPersonalityMetrics(personalityId: string): PerformanceMetric[] {
        return this.metrics.filter(m => m.personalityId === personalityId);
    }

    /**
     * Get aggregated performance statistics for a model
     */
    getModelStats(modelId: string): {
        avgResponseTime: number;
        avgQualityScore: number;
        successRate: number;
        totalRequests: number;
        recommendationScore: number;
    } {
        const modelMetrics = this.getModelMetrics(modelId);
        
        if (modelMetrics.length === 0) {
            return {
                avgResponseTime: 0,
                avgQualityScore: 0,
                successRate: 0,
                totalRequests: 0,
                recommendationScore: 0
            };
        }

        const avgResponseTime = modelMetrics.reduce((sum, m) => sum + m.responseTime, 0) / modelMetrics.length;
        const avgQualityScore = modelMetrics.reduce((sum, m) => sum + m.qualityScore, 0) / modelMetrics.length;
        const successfulRequests = modelMetrics.filter(m => m.errorRate === 0).length;
        const successRate = successfulRequests / modelMetrics.length;
        const recommendationScore = this.calculateRecommendationScore(avgResponseTime, avgQualityScore, successRate);

        return {
            avgResponseTime,
            avgQualityScore,
            successRate,
            totalRequests: modelMetrics.length,
            recommendationScore
        };
    }

    /**
     * Get the best performing model for a specific task type
     */
    getBestModelForTask(taskType: string): string | null {
        const taskMetrics = this.metrics.filter(m => m.taskType === taskType);
        
        if (taskMetrics.length === 0) {return null;}

        // Group by model and calculate scores
        const modelScores = new Map<string, number>();
        
        for (const metric of taskMetrics) {
            const currentScore = modelScores.get(metric.modelId) || 0;
            const newScore = this.calculateMetricScore(metric);
            modelScores.set(metric.modelId, Math.max(currentScore, newScore));
        }

        // Find the best scoring model
        let bestModel = null;
        let bestScore = 0;
        
        for (const [modelId, score] of modelScores.entries()) {
            if (score > bestScore) {
                bestScore = score;
                bestModel = modelId;
            }
        }

        return bestModel;
    }

    /**
     * Get real-time recommendations for optimal model assignments
     */
    getOptimalAssignments(): { personalityId: string; recommendedModelId: string; confidence: number }[] {
        const personalities = ['buzzy', 'builder', 'scout', 'guardian', 'spark', 'scribe', 'metrics', 'flash', 'honey', 'tester'];
        const recommendations: { personalityId: string; recommendedModelId: string; confidence: number }[] = [];

        for (const personalityId of personalities) {
            const personalityMetrics = this.getPersonalityMetrics(personalityId);
            
            if (personalityMetrics.length === 0) {continue;}

            // Find the best performing model for this personality
            const modelPerformance = new Map<string, number>();
            
            for (const metric of personalityMetrics) {
                const score = this.calculateMetricScore(metric);
                const currentBest = modelPerformance.get(metric.modelId) || 0;
                modelPerformance.set(metric.modelId, Math.max(currentBest, score));
            }

            let bestModel = null;
            let bestScore = 0;
            
            for (const [modelId, score] of modelPerformance.entries()) {
                if (score > bestScore) {
                    bestScore = score;
                    bestModel = modelId;
                }
            }

            if (bestModel) {
                recommendations.push({
                    personalityId,
                    recommendedModelId: bestModel,
                    confidence: bestScore
                });
            }
        }

        return recommendations.sort((a, b) => b.confidence - a.confidence);
    }

    /**
     * Get model health status
     */
    getModelHealth(modelId: string): ModelHealthStatus | null {
        return this.healthStatus.get(modelId) || null;
    }

    /**
     * Get all model health statuses
     */
    getAllModelHealth(): ModelHealthStatus[] {
        return Array.from(this.healthStatus.values());
    }

    /**
     * Export performance data for analysis
     */
    exportPerformanceData(): {
        metrics: PerformanceMetric[];
        healthStatus: ModelHealthStatus[];
        summary: {
            totalRequests: number;
            avgResponseTime: number;
            avgQualityScore: number;
            overallSuccessRate: number;
        };
    } {
        const totalRequests = this.metrics.length;
        const avgResponseTime = totalRequests > 0 ? this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests : 0;
        const avgQualityScore = totalRequests > 0 ? this.metrics.reduce((sum, m) => sum + m.qualityScore, 0) / totalRequests : 0;
        const successfulRequests = this.metrics.filter(m => m.errorRate === 0).length;
        const overallSuccessRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;

        return {
            metrics: this.metrics,
            healthStatus: Array.from(this.healthStatus.values()),
            summary: {
                totalRequests,
                avgResponseTime,
                avgQualityScore,
                overallSuccessRate
            }
        };
    }

    /**
     * Clear all performance data (for privacy/reset)
     */
    clearAllData(): void {
        this.metrics = [];
        this.healthStatus.clear();
        this.saveMetrics();
        vscode.window.showInformationMessage('🧹 Performance data cleared successfully!');
    }

    // Private helper methods

    private updateModelHealth(metric: PerformanceMetric): void {
        const recentMetrics = this.getModelMetrics(metric.modelId).slice(-20); // Last 20 requests
        
        const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
        const successfulRequests = recentMetrics.filter(m => m.errorRate === 0).length;
        const successRate = successfulRequests / recentMetrics.length;
        const isHealthy = successRate > 0.8 && avgResponseTime < 30000; // 30 second threshold
        const recommendationScore = this.calculateRecommendationScore(avgResponseTime, 
            recentMetrics.reduce((sum, m) => sum + m.qualityScore, 0) / recentMetrics.length,
            successRate
        );

        const newHealth: ModelHealthStatus = {
            modelId: metric.modelId,
            isHealthy,
            avgResponseTime,
            successRate,
            lastHealthCheck: new Date(),
            recommendationScore
        };

        this.healthStatus.set(metric.modelId, newHealth);
    }

    private calculateMetricScore(metric: PerformanceMetric): number {
        // Score based on quality (60%), speed (25%), and reliability (15%)
        const qualityScore = metric.qualityScore * 0.6;
        const speedScore = (metric.responseTime < 5000 ? 0.25 : metric.responseTime < 15000 ? 0.15 : 0.05);
        const reliabilityScore = (metric.errorRate === 0 ? 0.15 : 0);
        
        return qualityScore + speedScore + reliabilityScore;
    }

    private calculateRecommendationScore(avgResponseTime: number, avgQualityScore: number, successRate: number): number {
        const qualityWeight = 0.5;
        const speedWeight = 0.3;
        const reliabilityWeight = 0.2;

        const qualityScore = avgQualityScore * qualityWeight;
        const speedScore = (avgResponseTime < 5000 ? 1 : avgResponseTime < 15000 ? 0.7 : 0.3) * speedWeight;
        const reliabilityScore = successRate * reliabilityWeight;

        return Math.min(qualityScore + speedScore + reliabilityScore, 1.0);
    }

    private startPeriodicHealthChecks(): void {
        // Run health checks every 5 minutes
        setInterval(() => {
            this.performHealthChecks();
        }, 5 * 60 * 1000);
    }

    private performHealthChecks(): void {
        if (!this.monitoringEnabled) {return;}

        // Update health status for all models with recent activity
        const recentModels = new Set(
            this.metrics
                .filter(m => Date.now() - m.timestamp.getTime() < 30 * 60 * 1000) // Last 30 minutes
                .map(m => m.modelId)
        );

        for (const modelId of recentModels) {
            const recentMetrics = this.getModelMetrics(modelId).slice(-10);
            if (recentMetrics.length > 0) {
                const lastMetric = recentMetrics[recentMetrics.length - 1];
                this.updateModelHealth(lastMetric);
            }
        }
    }

    private async saveMetrics(): Promise<void> {
        try {
            const config = vscode.workspace.getConfiguration('aiCodePro');
            await config.update('performanceMetrics', {
                metrics: this.metrics.slice(-100), // Save last 100 metrics
                healthStatus: Array.from(this.healthStatus.entries())
            }, vscode.ConfigurationTarget.Global);
        } catch (error) {
            console.error('Failed to save performance metrics:', error);
        }
    }

    private loadStoredMetrics(): void {
        try {
            const config = vscode.workspace.getConfiguration('aiCodePro');
            const stored = config.get('performanceMetrics') as any;
            
            if (stored?.metrics) {
                this.metrics = stored.metrics.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
            }
            
            if (stored?.healthStatus) {
                this.healthStatus = new Map(stored.healthStatus.map(([id, health]: [string, any]) => [
                    id,
                    { ...health, lastHealthCheck: new Date(health.lastHealthCheck) }
                ]));
            }
        } catch (error) {
            console.error('Failed to load stored metrics:', error);
        }
    }

    /**
     * Enable/disable performance monitoring
     */
    setMonitoringEnabled(enabled: boolean): void {
        this.monitoringEnabled = enabled;
        console.log(`📊 Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Get monitoring status
     */
    isMonitoringEnabled(): boolean {
        return this.monitoringEnabled;
    }
}