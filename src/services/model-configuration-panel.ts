import * as vscode from 'vscode';
import { LocalLLMService, LocalLLMModel } from './local-llm-service';
import { AIPersonalityService, AIPersonality } from './ai-personality-service';

export interface ModelPerformanceMetrics {
    responseTime: number;
    successRate: number;
    qualityScore: number;
    lastTested: Date;
    recommendationScore: number;
}

export interface ModelAssignment {
    personalityId: string;
    modelId: string;
    isAutoAssigned: boolean;
    performance: ModelPerformanceMetrics;
    fallbackModels: string[];
}

export interface OptimalConfiguration {
    assignments: ModelAssignment[];
    globalSettings: {
        autoOptimize: boolean;
        performanceMonitoring: boolean;
        autoFallback: boolean;
        errorPrevention: boolean;
    };
    lastUpdated: Date;
}

export class ModelConfigurationPanel {
    public static currentPanel: ModelConfigurationPanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private disposables: vscode.Disposable[] = [];
    private llmService: LocalLLMService;
    private personalityService: AIPersonalityService;
    private performanceData: Map<string, ModelPerformanceMetrics> = new Map();
    private optimalConfig: OptimalConfiguration;

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ModelConfigurationPanel.currentPanel) {
            ModelConfigurationPanel.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'aiCodeProModelConfig',
            '🤖 AI Model Configuration Pro',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media'),
                    vscode.Uri.joinPath(extensionUri, 'out', 'media')
                ]
            }
        );

        ModelConfigurationPanel.currentPanel = new ModelConfigurationPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, private readonly extensionUri: vscode.Uri) {
        this.panel = panel;
        this.llmService = new LocalLLMService();
        this.personalityService = new AIPersonalityService();
        
        // Initialize optimal configuration
        this.optimalConfig = {
            assignments: [],
            globalSettings: {
                autoOptimize: true,
                performanceMonitoring: true,
                autoFallback: true,
                errorPrevention: true
            },
            lastUpdated: new Date()
        };

        this.update();
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case 'autoDetectModels':
                        this.autoDetectAndTestModels();
                        return;
                    case 'autoOptimizeAssignments':
                        this.autoOptimizeAssignments();
                        return;
                    case 'assignModel':
                        this.assignModelToPersonality(message.personalityId, message.modelId, false);
                        return;
                    case 'enableAutoMode':
                        this.enableFullAutoMode();
                        return;
                    case 'exportConfiguration':
                        this.exportConfiguration();
                        return;
                    case 'importConfiguration':
                        this.importConfiguration();
                        return;
                    case 'testConfiguration':
                        this.testCurrentConfiguration();
                        return;
                }
            },
            null,
            this.disposables
        );
    }

    private async autoDetectAndTestModels() {
        vscode.window.showInformationMessage('🔍 Auto-detecting and testing models...');
        
        try {
            // Discover available models
            const models = await this.llmService.discoverModels();
            console.log(`🧠 Found ${models.length} models`);

            // Test each model automatically
            for (const model of models) {
                await this.testModelPerformance(model);
            }

            // Auto-assign optimal models to personalities
            await this.autoOptimizeAssignments();
            
            vscode.window.showInformationMessage(`✅ Auto-configured ${models.length} models optimally!`);
            this.update();
        } catch (error) {
            vscode.window.showErrorMessage(`❌ Auto-detection failed: ${error}`);
        }
    }

    private async testModelPerformance(model: LocalLLMModel): Promise<ModelPerformanceMetrics> {
        const startTime = Date.now();
        
        try {
            // Test with a simple coding task
            const testPrompt = "Write a simple Python function that adds two numbers.";
            const response = await this.llmService.generateResponse(testPrompt, model.id);
            
            const responseTime = Date.now() - startTime;
            const qualityScore = this.calculateQualityScore(response.text);
            
            const metrics: ModelPerformanceMetrics = {
                responseTime,
                successRate: 1.0,
                qualityScore,
                lastTested: new Date(),
                recommendationScore: this.calculateRecommendationScore(model, responseTime, qualityScore)
            };

            this.performanceData.set(model.id, metrics);
            return metrics;
        } catch (error) {
            const metrics: ModelPerformanceMetrics = {
                responseTime: 0,
                successRate: 0,
                qualityScore: 0,
                lastTested: new Date(),
                recommendationScore: 0
            };
            
            this.performanceData.set(model.id, metrics);
            return metrics;
        }
    }

    private calculateQualityScore(response: string): number {
        // Auto-score based on response quality
        let score = 0.5; // Base score
        
        // Check for code presence
        if (response.includes('def ') || response.includes('function')) {
            score += 0.2;
        }
        
        // Check for proper structure
        if (response.includes('return')) {
            score += 0.15;
        }
        
        // Check response length (not too short, not too long)
        if (response.length > 50 && response.length < 500) {score += 0.1;}
        
        // Check for Python syntax
        if (response.includes('def add') || response.includes('def ')) {score += 0.05;}
        
        return Math.min(score, 1.0);
    }

    private calculateRecommendationScore(model: LocalLLMModel, responseTime: number, qualityScore: number): number {
        // Auto-calculate how good this model is for assignment
        let score = qualityScore * 0.6; // Quality is most important
        
        // Speed bonus (faster is better, but not too important)
        if (responseTime < 5000) {score += 0.2;}
        else if (responseTime < 10000) {score += 0.1;}
        
        // Model type bonus
        if (model.capabilities.includes('code-generation')) {score += 0.15;}
        if (model.name.includes('coder') || model.name.includes('code')) {score += 0.05;}
        
        return Math.min(score, 1.0);
    }

    private async autoOptimizeAssignments() {
        console.log('🎯 Auto-optimizing personality-model assignments...');
        
        const personalities = this.personalityService.getAllPersonalities();
        const models = await this.llmService.getAvailableModels();
        
        // Clear existing assignments
        this.optimalConfig.assignments = [];
        
        for (const personality of personalities) {
            const optimalModel = this.findOptimalModelForPersonality(personality, models);
            const fallbackModels = this.findFallbackModels(optimalModel, models);
            
            if (optimalModel) {
                const assignment: ModelAssignment = {
                    personalityId: personality.id,
                    modelId: optimalModel.id,
                    isAutoAssigned: true,
                    performance: this.performanceData.get(optimalModel.id) || {
                        responseTime: 0,
                        successRate: 0,
                        qualityScore: 0,
                        lastTested: new Date(),
                        recommendationScore: 0
                    },
                    fallbackModels: fallbackModels.map(m => m.id)
                };
                
                this.optimalConfig.assignments.push(assignment);
                console.log(`✅ Auto-assigned ${optimalModel.name} to ${personality.name}`);
            }
        }
        
        this.optimalConfig.lastUpdated = new Date();
        await this.saveConfiguration();
    }

    private findOptimalModelForPersonality(personality: AIPersonality, models: LocalLLMModel[]): LocalLLMModel | null {
        // Auto-select best model based on personality preferences and performance
        const availablePreferred = models.filter(model =>
            personality.preferredModels.some(pref => 
                model.id.includes(pref) || model.name.includes(pref)
            )
        );
        
        if (availablePreferred.length === 0) {
            // Fallback to any code model
            const codeModels = models.filter(m => m.capabilities.includes('code-generation'));
            if (codeModels.length > 0) {
                return this.getBestPerformingModel(codeModels);
            }
            return models.length > 0 ? models[0] : null;
        }
        
        return this.getBestPerformingModel(availablePreferred);
    }

    private getBestPerformingModel(models: LocalLLMModel[]): LocalLLMModel | null {
        if (models.length === 0) {return null;}
        
        // Sort by recommendation score (auto-calculated performance)
        return models.sort((a, b) => {
            const scoreA = this.performanceData.get(a.id)?.recommendationScore || 0;
            const scoreB = this.performanceData.get(b.id)?.recommendationScore || 0;
            return scoreB - scoreA;
        })[0];
    }

    private findFallbackModels(primaryModel: LocalLLMModel | null, models: LocalLLMModel[]): LocalLLMModel[] {
        if (!primaryModel) {
            return [];
        }
        
        // Auto-select fallback models with similar capabilities
        return models
            .filter(m => m.id !== primaryModel.id)
            .filter(m => m.capabilities.includes('code-generation'))
            .sort((a, b) => {
                const scoreA = this.performanceData.get(a.id)?.recommendationScore || 0;
                const scoreB = this.performanceData.get(b.id)?.recommendationScore || 0;
                return scoreB - scoreA;
            })
            .slice(0, 2); // Top 2 fallbacks
    }

    private async enableFullAutoMode() {
        this.optimalConfig.globalSettings.autoOptimize = true;
        this.optimalConfig.globalSettings.performanceMonitoring = true;
        this.optimalConfig.globalSettings.autoFallback = true;
        this.optimalConfig.globalSettings.errorPrevention = true;
        
        await this.autoDetectAndTestModels();
        vscode.window.showInformationMessage('🤖 Full auto mode enabled! All configurations optimized automatically.');
    }

    private async assignModelToPersonality(personalityId: string, modelId: string, isAuto: boolean) {
        const existingIndex = this.optimalConfig.assignments.findIndex(a => a.personalityId === personalityId);
        const performance = this.performanceData.get(modelId) || {
            responseTime: 0,
            successRate: 0,
            qualityScore: 0,
            lastTested: new Date(),
            recommendationScore: 0
        };
        
        const assignment: ModelAssignment = {
            personalityId,
            modelId,
            isAutoAssigned: isAuto,
            performance,
            fallbackModels: []
        };
        
        if (existingIndex >= 0) {
            this.optimalConfig.assignments[existingIndex] = assignment;
        } else {
            this.optimalConfig.assignments.push(assignment);
        }
        
        await this.saveConfiguration();
        this.update();
    }

    private async exportConfiguration() {
        const configJson = JSON.stringify(this.optimalConfig, null, 2);
        const uri = await vscode.window.showSaveDialog({
            filters: { 'JSON': ['json'] },
            defaultUri: vscode.Uri.file('ai-model-config.json')
        });
        
        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(configJson, 'utf8'));
            vscode.window.showInformationMessage('✅ Configuration exported successfully!');
        }
    }

    private async importConfiguration() {
        const uri = await vscode.window.showOpenDialog({
            filters: { 'JSON': ['json'] },
            canSelectMany: false
        });
        
        if (uri && uri[0]) {
            try {
                const data = await vscode.workspace.fs.readFile(uri[0]);
                this.optimalConfig = JSON.parse(data.toString());
                await this.saveConfiguration();
                this.update();
                vscode.window.showInformationMessage('✅ Configuration imported successfully!');
            } catch (error) {
                vscode.window.showErrorMessage(`❌ Import failed: ${error}`);
            }
        }
    }

    private async testCurrentConfiguration() {
        vscode.window.showInformationMessage('🧪 Testing current configuration...');
        
        let successCount = 0;
        let totalTests = this.optimalConfig.assignments.length;
        
        for (const assignment of this.optimalConfig.assignments) {
            try {
                const testPrompt = "Hello! Please respond with a simple greeting.";
                await this.llmService.generateResponse(testPrompt, assignment.modelId);
                successCount++;
            } catch (error) {
                console.error(`Test failed for ${assignment.modelId}:`, error);
            }
        }
        
        const successRate = totalTests > 0 ? (successCount / totalTests) * 100 : 0;
        vscode.window.showInformationMessage(`🎯 Configuration test: ${successCount}/${totalTests} models working (${successRate.toFixed(1)}%)`);
    }

    private async saveConfiguration() {
        const config = vscode.workspace.getConfiguration('aiCodePro');
        await config.update('optimalModelConfiguration', this.optimalConfig, vscode.ConfigurationTarget.Global);
    }

    private async loadConfiguration() {
        const config = vscode.workspace.getConfiguration('aiCodePro');
        const saved = config.get('optimalModelConfiguration');
        if (saved) {
            this.optimalConfig = saved as OptimalConfiguration;
        }
    }

    public dispose() {
        ModelConfigurationPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private async update() {
        this.panel.webview.html = await this.getHtmlForWebview();
    }

    private async getHtmlForWebview(): Promise<string> {
        // HTML will be generated in the next step
        return this.generateConfigurationHTML();
    }

    private generateConfigurationHTML(): string {
        const personalities = this.personalityService.getAllPersonalities();
        const assignments = this.optimalConfig.assignments;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Model Configuration Pro</title>
    <style>
        body { 
            font-family: var(--vscode-font-family); 
            padding: 20px; 
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 30px;
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 20px;
        }
        .auto-button {
            background: linear-gradient(45deg, #007ACC, #0099CC);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .auto-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
        }
        .personality-card {
            background: var(--vscode-editor-widget-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            transition: all 0.3s ease;
        }
        .personality-card:hover {
            border-color: var(--vscode-focusBorder);
            transform: translateY(-2px);
        }
        .assignment-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
        }
        .performance-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        .metric {
            text-align: center;
            padding: 8px;
            background: var(--vscode-button-secondaryBackground);
            border-radius: 4px;
        }
        .auto-indicator {
            color: #4CAF50;
            font-weight: bold;
        }
        .manual-indicator {
            color: #FF9800;
            font-weight: bold;
        }
        .controls {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .control-button {
            padding: 8px 16px;
            border: 1px solid var(--vscode-button-border);
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 4px;
            cursor: pointer;
        }
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
        .status-optimal { background: #4CAF50; }
        .status-good { background: #2196F3; }
        .status-warning { background: #FF9800; }
        .status-error { background: #F44336; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 AI Model Configuration Pro</h1>
        <div>
            <button class="auto-button" onclick="enableAutoMode()">
                🚀 Enable Full Auto Mode
            </button>
        </div>
    </div>

    <div class="controls">
        <button class="control-button" onclick="autoDetectModels()">🔍 Auto-Detect Models</button>
        <button class="control-button" onclick="autoOptimizeAssignments()">🎯 Auto-Optimize</button>
        <button class="control-button" onclick="testConfiguration()">🧪 Test Configuration</button>
        <button class="control-button" onclick="exportConfiguration()">📤 Export</button>
        <button class="control-button" onclick="importConfiguration()">📥 Import</button>
    </div>

    <h2>🎭 Personality-Model Assignments</h2>
    
    ${personalities.map(personality => {
        const assignment = assignments.find(a => a.personalityId === personality.id);
        const hasAssignment = !!assignment;
        const isAuto = assignment?.isAutoAssigned || false;
        const performance = assignment?.performance;
        
        return `
        <div class="personality-card">
            <h3>${personality.emoji} ${personality.name}</h3>
            <p><strong>Specialty:</strong> ${personality.specialty}</p>
            <p><strong>Preferred Models:</strong> ${personality.preferredModels.join(', ')}</p>
            
            <div class="assignment-status">
                <div>
                    ${hasAssignment ? `
                        <span class="status-indicator ${this.getStatusClass(performance)}"></span>
                        <strong>Assigned:</strong> ${assignment.modelId}
                        <span class="${isAuto ? 'auto-indicator' : 'manual-indicator'}">
                            ${isAuto ? '(Auto)' : '(Manual)'}
                        </span>
                    ` : `
                        <span class="status-indicator status-error"></span>
                        <strong>No Assignment</strong>
                    `}
                </div>
            </div>
            
            ${performance ? `
                <div class="performance-metrics">
                    <div class="metric">
                        <div>Response Time</div>
                        <div><strong>${performance.responseTime}ms</strong></div>
                    </div>
                    <div class="metric">
                        <div>Quality Score</div>
                        <div><strong>${(performance.qualityScore * 100).toFixed(1)}%</strong></div>
                    </div>
                    <div class="metric">
                        <div>Success Rate</div>
                        <div><strong>${(performance.successRate * 100).toFixed(1)}%</strong></div>
                    </div>
                    <div class="metric">
                        <div>Recommendation</div>
                        <div><strong>${(performance.recommendationScore * 100).toFixed(1)}%</strong></div>
                    </div>
                </div>
            ` : ''}
            
            ${assignment?.fallbackModels?.length ? `
                <p><strong>Fallback Models:</strong> ${assignment.fallbackModels.join(', ')}</p>
            ` : ''}
        </div>
        `;
    }).join('')}

    <script>
        const vscode = acquireVsCodeApi();
        
        function autoDetectModels() {
            vscode.postMessage({ type: 'autoDetectModels' });
        }
        
        function autoOptimizeAssignments() {
            vscode.postMessage({ type: 'autoOptimizeAssignments' });
        }
        
        function enableAutoMode() {
            vscode.postMessage({ type: 'enableAutoMode' });
        }
        
        function testConfiguration() {
            vscode.postMessage({ type: 'testConfiguration' });
        }
        
        function exportConfiguration() {
            vscode.postMessage({ type: 'exportConfiguration' });
        }
        
        function importConfiguration() {
            vscode.postMessage({ type: 'importConfiguration' });
        }
    </script>
</body>
</html>`;
    }

    private getStatusClass(performance?: ModelPerformanceMetrics): string {
        if (!performance) {return 'status-error';}
        
        const score = performance.recommendationScore;
        if (score >= 0.8) {return 'status-optimal';}
        if (score >= 0.6) {return 'status-good';}
        if (score >= 0.4) {return 'status-warning';}
        return 'status-error';
    }
}