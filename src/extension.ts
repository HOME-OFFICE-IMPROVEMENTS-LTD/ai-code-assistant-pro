import * as vscode from 'vscode';
import { AIPersonalityService } from './services/ai-personality-service';
import { LocalLLMService } from './services/local-llm-service';
import { CodeGenerationService } from './services/code-generation-service';
import { ChatWebviewProvider } from './webview/chat-webview-provider';
import { ModelsTreeDataProvider } from './providers/models-tree-provider';
import { ModelConfigurationPanel } from './services/model-configuration-panel';

export function activate(context: vscode.ExtensionContext) {
    console.log('🤖 AI Code Assistant Pro is now active!');
    
    // Initialize services
    const aiPersonalityService = new AIPersonalityService();
    const localLLMService = new LocalLLMService();
    const codeGenerationService = new CodeGenerationService(localLLMService, aiPersonalityService);
    
    // Initialize webview provider
    const chatProvider = new ChatWebviewProvider(context.extensionUri, codeGenerationService);
    
    // Initialize tree data provider for models
    const modelsTreeProvider = new ModelsTreeDataProvider(localLLMService);
    
    // Register webview and tree provider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('aiCodePro.chat', chatProvider),
        vscode.window.createTreeView('aiCodePro.models', {
            treeDataProvider: modelsTreeProvider,
            showCollapseAll: false
        })
    );

    // Auto-discover models on startup
    localLLMService.discoverModels().then(() => {
        modelsTreeProvider.refresh();
    });

    // Command: Show AI Chat
    const showChatCommand = vscode.commands.registerCommand('aiCodePro.showChat', () => {
        const panel = vscode.window.createWebviewPanel(
            'aiCodeProChat',
            '🤖 AI Code Assistant Pro',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [context.extensionUri]
            }
        );
        
        panel.webview.html = chatProvider.getWebviewContent();
        chatProvider.setWebviewPanel(panel);
    });

    // Command: Ask Buzzy (Performance Expert)
    const askBuzzyCommand = vscode.commands.registerCommand('aiCodePro.askBuzzy', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please open a file first!');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection.isEmpty ? undefined : selection);
        
        const response = await codeGenerationService.askPersonality('buzzy', 
            `Analyze this code for performance optimization:\n\n${text}`);
        
        showAIResponse('⚡ Buzzy\'s Performance Analysis', response);
    });

    // Command: Ask Builder (Architecture Expert)
    const askBuilderCommand = vscode.commands.registerCommand('aiCodePro.askBuilder', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please open a file first!');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection.isEmpty ? undefined : selection);
        
        const response = await codeGenerationService.askPersonality('builder', 
            `Review this code architecture and suggest improvements:\n\n${text}`);
        
        showAIResponse('🔨 Builder\'s Architecture Review', response);
    });

    // Command: Ask Scout (Code Analyst)
    const askScoutCommand = vscode.commands.registerCommand('aiCodePro.askScout', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please open a file first!');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection.isEmpty ? undefined : selection);
        
        const response = await codeGenerationService.askPersonality('scout', 
            `Analyze this code for patterns, issues, and opportunities:\n\n${text}`);
        
        showAIResponse('🔍 Scout\'s Code Analysis', response);
    });

    // Command: Ask Guardian (Security Expert)
    const askGuardianCommand = vscode.commands.registerCommand('aiCodePro.askGuardian', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please open a file first!');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection.isEmpty ? undefined : selection);
        
        const response = await codeGenerationService.askPersonality('guardian', 
            `Perform security analysis on this code:\n\n${text}`);
        
        showAIResponse('🛡️ Guardian\'s Security Analysis', response);
    });

    // Command: Generate Code
    const generateCodeCommand = vscode.commands.registerCommand('aiCodePro.generateCode', async () => {
        const prompt = await vscode.window.showInputBox({
            prompt: '🧠 Describe what code you want to generate',
            placeHolder: 'e.g., Create a REST API endpoint for user authentication...'
        });

        if (!prompt) {return;}

        const personality = await vscode.window.showQuickPick([
            { label: '⚡ Buzzy', description: 'Performance-optimized code', value: 'buzzy' },
            { label: '🔨 Builder', description: 'Well-architected, scalable code', value: 'builder' },
            { label: '🔍 Scout', description: 'Clean, analyzable code', value: 'scout' },
            { label: '🛡️ Guardian', description: 'Security-focused code', value: 'guardian' },
            { label: '✨ Spark', description: 'Creative, innovative code', value: 'spark' }
        ], {
            placeHolder: 'Choose AI personality for code generation'
        });

        if (!personality) {return;}

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `🤖 ${personality.label} is generating code...`,
            cancellable: false
        }, async () => {
            const response = await codeGenerationService.generateCode(personality.value, prompt);
            
            // Insert generated code into editor
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, response);
                });
            } else {
                // Create new file with generated code
                const document = await vscode.workspace.openTextDocument({
                    content: response,
                    language: 'typescript'
                });
                await vscode.window.showTextDocument(document);
            }
        });
    });

    // Command: Explain Code
    const explainCodeCommand = vscode.commands.registerCommand('aiCodePro.explainCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please select code to explain!');
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showInformationMessage('Please select code to explain!');
            return;
        }

        const text = editor.document.getText(selection);
        const response = await codeGenerationService.askPersonality('scribe', 
            `Explain this code in detail:\n\n${text}`);
        
        showAIResponse('📖 Code Explanation', response);
    });

    // Command: Optimize Code
    const optimizeCodeCommand = vscode.commands.registerCommand('aiCodePro.optimizeCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please select code to optimize!');
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection.isEmpty ? undefined : selection);
        
        const response = await codeGenerationService.askPersonality('buzzy', 
            `Optimize this code for better performance:\n\n${text}`);
        
        // Show optimized code in diff view
        const originalUri = vscode.Uri.parse('untitled:Original');
        const optimizedUri = vscode.Uri.parse('untitled:Optimized');
        
        await vscode.workspace.openTextDocument(originalUri).then(doc => {
            return vscode.window.showTextDocument(doc).then(editor => {
                return editor.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), text);
                });
            });
        });
        
        await vscode.workspace.openTextDocument(optimizedUri).then(doc => {
            return vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside).then(editor => {
                return editor.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), response);
                });
            });
        });
    });

    // Command: Configure Models
    const configureModelsCommand = vscode.commands.registerCommand('aiCodePro.configureModels', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'aiCodePro');
    });

    // Command: Connect to Local LLMs
    const connectModelsCommand = vscode.commands.registerCommand('aiCodePro.connectModels', async () => {
        const models = await localLLMService.discoverModels();
        if (models.length > 0) {
            vscode.window.showInformationMessage(`🧠 Connected to ${models.length} local LLM model(s): ${models.map(m => m.name).join(', ')}`);
            modelsTreeProvider.refresh(); // Refresh the tree view
        } else {
            vscode.window.showWarningMessage('🤖 No local LLM models found. Please ensure Ollama or LocalAI is running.');
        }
    });

    // Command: Show Model Stats
    const showModelStatsCommand = vscode.commands.registerCommand('aiCodePro.showModelStats', async () => {
        const models = localLLMService.getAvailableModels();
        if (models.length === 0) {
            vscode.window.showInformationMessage('🧠 No models connected. Click "Connect to Local LLMs" first.');
            return;
        }

        const statsPanel = vscode.window.createWebviewPanel(
            'aiCodeProModelStats',
            '📊 Model Statistics',
            vscode.ViewColumn.Two,
            { enableScripts: true }
        );

        const modelsList = models.map(model => 
            `<div class="model-item">
                <h3>🧠 ${model.name}</h3>
                <p><strong>Size:</strong> ${model.size}</p>
                <p><strong>Status:</strong> ${model.status}</p>
                <p><strong>Capabilities:</strong> ${model.capabilities.join(', ')}</p>
            </div>`
        ).join('');

        statsPanel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: var(--vscode-font-family); padding: 20px; }
                    .model-item { border: 1px solid var(--vscode-panel-border); padding: 15px; margin: 10px 0; border-radius: 5px; }
                    h3 { margin-top: 0; color: var(--vscode-textLink-foreground); }
                </style>
            </head>
            <body>
                <h1>📊 Local LLM Model Statistics</h1>
                ${modelsList || '<p>No models available</p>'}
            </body>
            </html>
        `;
    });

    // Command: Model Settings
    const modelSettingsCommand = vscode.commands.registerCommand('aiCodePro.modelSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'aiCodePro.localLLMEndpoint');
    });

    // Command: Advanced Model Configuration (NEW!)
    const advancedModelConfigCommand = vscode.commands.registerCommand('aiCodePro.advancedModelConfig', () => {
        ModelConfigurationPanel.createOrShow(context.extensionUri);
    });

    // Register all commands
    context.subscriptions.push(
        showChatCommand,
        askBuzzyCommand,
        askBuilderCommand,
        askScoutCommand,
        askGuardianCommand,
        generateCodeCommand,
        explainCodeCommand,
        optimizeCodeCommand,
        configureModelsCommand,
        connectModelsCommand,
        showModelStatsCommand,
        modelSettingsCommand,
        advancedModelConfigCommand
    );

    // Show welcome message
    vscode.window.showInformationMessage(
        '🤖 AI Code Assistant Pro activated! 10 AI personalities ready to help.',
        'Open AI Chat',
        'View Personalities'
    ).then(selection => {
        if (selection === 'Open AI Chat') {
            vscode.commands.executeCommand('aiCodePro.showChat');
        } else if (selection === 'View Personalities') {
            vscode.commands.executeCommand('workbench.view.explorer');
        }
    });
}

function showAIResponse(title: string, content: string) {
    const panel = vscode.window.createWebviewPanel(
        'aiResponse',
        title,
        vscode.ViewColumn.Two,
        {
            enableScripts: true
        }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    color: var(--vscode-foreground);
                    background: var(--vscode-editor-background);
                }
                .header {
                    font-size: 1.5em;
                    margin-bottom: 20px;
                    color: var(--vscode-textLink-foreground);
                }
                .content {
                    white-space: pre-wrap;
                    font-family: var(--vscode-editor-font-family);
                    font-size: var(--vscode-editor-font-size);
                    line-height: 1.6;
                }
                code {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 2px 4px;
                    border-radius: 3px;
                }
                pre {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 12px;
                    border-radius: 6px;
                    overflow-x: auto;
                }
            </style>
        </head>
        <body>
            <div class="header">${title}</div>
            <div class="content">${content.replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code>$1</code>')}</div>
        </body>
        </html>
    `;
}

export function deactivate() {
    console.log('🤖 AI Code Assistant Pro deactivated');
}
