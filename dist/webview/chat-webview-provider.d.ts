import * as vscode from 'vscode';
import { CodeGenerationService } from '../services/code-generation-service';
export declare class ChatWebviewProvider implements vscode.WebviewViewProvider {
    private readonly _extensionUri;
    private readonly _codeGenerationService;
    static readonly viewType = "aiCodePro.chat";
    private _view?;
    private _panel?;
    constructor(_extensionUri: vscode.Uri, _codeGenerationService: CodeGenerationService);
    resolveWebviewView(webviewView: vscode.WebviewView): void;
    setWebviewPanel(panel: vscode.WebviewPanel): void;
    private handleMessage;
    private handleUserMessage;
    getWebviewContent(): string;
}
//# sourceMappingURL=chat-webview-provider.d.ts.map