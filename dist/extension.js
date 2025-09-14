"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ai_personality_service_1 = require("./services/ai-personality-service");
const local_llm_service_1 = require("./services/local-llm-service");
const code_generation_service_1 = require("./services/code-generation-service");
const chat_webview_provider_1 = require("./webview/chat-webview-provider");
function activate(context) {
    console.log('🤖 AI Code Assistant Pro is now active!');
    // Initialize services
    const aiPersonalityService = new ai_personality_service_1.AIPersonalityService();
    const localLLMService = new local_llm_service_1.LocalLLMService();
    const codeGenerationService = new code_generation_service_1.CodeGenerationService(localLLMService, aiPersonalityService);
    // Initialize webview provider
    const chatProvider = new chat_webview_provider_1.ChatWebviewProvider(context.extensionUri, codeGenerationService);
    // Register webview
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('aiCodePro.chat', chatProvider));
    // Command: Show AI Chat
    const showChatCommand = vscode.commands.registerCommand('aiCodePro.showChat', () => {
        const panel = vscode.window.createWebviewPanel('aiCodeProChat', '🤖 AI Code Assistant Pro', vscode.ViewColumn.Two, {
            enableScripts: true,
            localResourceRoots: [context.extensionUri]
        });
        panel.webview.html = chatProvider.getWebviewContent(panel.webview);
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
        const response = await codeGenerationService.askPersonality('buzzy', `Analyze this code for performance optimization:\n\n${text}`);
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
        const response = await codeGenerationService.askPersonality('builder', `Review this code architecture and suggest improvements:\n\n${text}`);
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
        const response = await codeGenerationService.askPersonality('scout', `Analyze this code for patterns, issues, and opportunities:\n\n${text}`);
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
        const response = await codeGenerationService.askPersonality('guardian', `Perform security analysis on this code:\n\n${text}`);
        showAIResponse('🛡️ Guardian\'s Security Analysis', response);
    });
    // Command: Generate Code
    const generateCodeCommand = vscode.commands.registerCommand('aiCodePro.generateCode', async () => {
        const prompt = await vscode.window.showInputBox({
            prompt: '🧠 Describe what code you want to generate',
            placeHolder: 'e.g., Create a REST API endpoint for user authentication...'
        });
        if (!prompt)
            return;
        const personality = await vscode.window.showQuickPick([
            { label: '⚡ Buzzy', description: 'Performance-optimized code', value: 'buzzy' },
            { label: '🔨 Builder', description: 'Well-architected, scalable code', value: 'builder' },
            { label: '🔍 Scout', description: 'Clean, analyzable code', value: 'scout' },
            { label: '🛡️ Guardian', description: 'Security-focused code', value: 'guardian' },
            { label: '✨ Spark', description: 'Creative, innovative code', value: 'spark' }
        ], {
            placeHolder: 'Choose AI personality for code generation'
        });
        if (!personality)
            return;
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
            }
            else {
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
        const response = await codeGenerationService.askPersonality('scribe', `Explain this code in detail:\n\n${text}`);
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
        const response = await codeGenerationService.askPersonality('buzzy', `Optimize this code for better performance:\n\n${text}`);
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
    // Register all commands
    context.subscriptions.push(showChatCommand, askBuzzyCommand, askBuilderCommand, askScoutCommand, askGuardianCommand, generateCodeCommand, explainCodeCommand, optimizeCodeCommand);
    // Show welcome message
    vscode.window.showInformationMessage('🤖 AI Code Assistant Pro activated! 10 AI personalities ready to help.', 'Open AI Chat', 'View Personalities').then(selection => {
        if (selection === 'Open AI Chat') {
            vscode.commands.executeCommand('aiCodePro.showChat');
        }
        else if (selection === 'View Personalities') {
            vscode.commands.executeCommand('workbench.view.explorer');
        }
    });
}
function showAIResponse(title, content) {
    const panel = vscode.window.createWebviewPanel('aiResponse', title, vscode.ViewColumn.Two, {
        enableScripts: true
    });
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
function deactivate() {
    console.log('🤖 AI Code Assistant Pro deactivated');
}
//# sourceMappingURL=extension.js.map