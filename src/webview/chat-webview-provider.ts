import * as vscode from 'vscode';
import { CodeGenerationService } from '../services/code-generation-service';

export interface WebviewMessage {
    type: string;
    text?: string;
    personality?: string;
    [key: string]: unknown;
}

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'aiCodePro.chat';
    private _view?: vscode.WebviewView;
    private _panel?: vscode.WebviewPanel;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _codeGenerationService: CodeGenerationService
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this.getWebviewContent();

        webviewView.webview.onDidReceiveMessage(
            message => this.handleMessage(message),
            undefined,
            []
        );
    }

    public setWebviewPanel(panel: vscode.WebviewPanel) {
        this._panel = panel;
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message),
            undefined,
            []
        );
    }

    private async handleMessage(message: WebviewMessage) {
        switch (message.type) {
            case 'sendMessage':
                if (message.text) {
                    await this.handleUserMessage(message.text, message.personality || 'scout');
                }
                break;
        }
    }

    private async handleUserMessage(text: string, personality: string) {
        const webview = this._panel?.webview || this._view?.webview;
        if (!webview) {return;}

        // Show typing indicator
        webview.postMessage({
            type: 'aiTyping',
            personality: personality
        });

        try {
            const response = await this._codeGenerationService.askPersonality(personality, text);
            
            webview.postMessage({
                type: 'aiResponse',
                text: response,
                personality: personality
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : 'No stack trace';
            
            console.error('❌ Chat error:', error);
            console.error('❌ Error details:', {
                message: errorMessage,
                stack: errorStack,
                text: text,
                personality: personality
            });
            webview.postMessage({
                type: 'aiError',
                text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
                personality: personality
            });
        }
    }

    public getWebviewContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Code Assistant Pro</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    background: var(--vscode-editor-background);
                    color: var(--vscode-foreground);
                    margin: 0;
                    padding: 20px;
                }
                .chat-container {
                    height: 400px;
                    overflow-y: auto;
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background: var(--vscode-panel-background);
                }
                .message {
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 8px;
                }
                .user-message {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    margin-left: 20px;
                }
                .ai-message {
                    background: var(--vscode-textCodeBlock-background);
                    margin-right: 20px;
                }
                .personality-selector {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 4px;
                }
                .input-container {
                    display: flex;
                    gap: 10px;
                }
                .message-input {
                    flex: 1;
                    padding: 10px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 4px;
                }
                .send-button {
                    padding: 10px 20px;
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .send-button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                .typing-indicator {
                    font-style: italic;
                    color: var(--vscode-descriptionForeground);
                }
                .personality-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 12px;
                    font-size: 0.8em;
                    margin-right: 8px;
                    background: var(--vscode-badge-background);
                    color: var(--vscode-badge-foreground);
                }
            </style>
        </head>
        <body>
            <div class="chat-container" id="chatContainer">
                <div class="message ai-message">
                    <span class="personality-badge">🤖</span>
                    Welcome to AI Code Assistant Pro! I'm ready to help with your coding tasks. Choose a personality and ask me anything!
                </div>
            </div>
            
            <select class="personality-selector" id="personalitySelector">
                <option value="buzzy">⚡ Buzzy - Performance Expert</option>
                <option value="builder">🔨 Builder - Architecture Guru</option>
                <option value="scout">🔍 Scout - Code Analyst</option>
                <option value="guardian">🛡️ Guardian - Security Expert</option>
                <option value="spark">✨ Spark - Innovation Master</option>
                <option value="scribe">📝 Scribe - Documentation Pro</option>
                <option value="metrics">📊 Metrics - Analytics Master</option>
                <option value="flash">⚡ Flash - Speed Optimizer</option>
                <option value="honey">🍯 Honey - Memory Expert</option>
                <option value="tester">🧪 Tester - QA Specialist</option>
            </select>
            
            <div class="input-container">
                <input type="text" class="message-input" id="messageInput" placeholder="Ask your AI assistant..." />
                <button class="send-button" id="sendButton">Send</button>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                const chatContainer = document.getElementById('chatContainer');
                const messageInput = document.getElementById('messageInput');
                const sendButton = document.getElementById('sendButton');
                const personalitySelector = document.getElementById('personalitySelector');

                function sendMessage() {
                    const text = messageInput.value.trim();
                    const personality = personalitySelector.value;
                    
                    if (!text) return;

                    // Add user message to chat
                    addMessage(text, 'user', personality);
                    
                    // Clear input
                    messageInput.value = '';
                    
                    // Send to extension
                    vscode.postMessage({
                        type: 'sendMessage',
                        text: text,
                        personality: personality
                    });
                }

                function addMessage(text, sender, personality) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = \`message \${sender}-message\`;
                    
                    const personalityIcon = {
                        'buzzy': '⚡',
                        'builder': '🔨',
                        'scout': '🔍',
                        'guardian': '🛡️',
                        'spark': '✨',
                        'scribe': '📝',
                        'metrics': '📊',
                        'flash': '⚡',
                        'honey': '🍯',
                        'tester': '🧪'
                    };
                    
                    if (sender === 'ai') {
                        messageDiv.innerHTML = \`<span class="personality-badge">\${personalityIcon[personality] || '🤖'}</span>\${text}\`;
                    } else {
                        messageDiv.innerHTML = \`<span class="personality-badge">👤</span>\${text}\`;
                    }
                    
                    chatContainer.appendChild(messageDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

                sendButton.addEventListener('click', sendMessage);
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });

                // Listen for messages from the extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    
                    switch (message.type) {
                        case 'aiResponse':
                            addMessage(message.text, 'ai', message.personality);
                            break;
                        case 'aiError':
                            addMessage(message.text, 'ai', message.personality);
                            break;
                        case 'aiTyping':
                            const typingDiv = document.createElement('div');
                            typingDiv.className = 'message ai-message typing-indicator';
                            typingDiv.innerHTML = \`<span class="personality-badge">🤖</span>Thinking...\`;
                            typingDiv.id = 'typing-indicator';
                            chatContainer.appendChild(typingDiv);
                            chatContainer.scrollTop = chatContainer.scrollHeight;
                            
                            // Remove typing indicator after response
                            setTimeout(() => {
                                const indicator = document.getElementById('typing-indicator');
                                if (indicator) {
                                    indicator.remove();
                                }
                            }, 1000);
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}
