import * as vscode from 'vscode';
import { LocalLLMService } from '../services/local-llm-service';
export declare class ModelsTreeDataProvider implements vscode.TreeDataProvider<ModelItem> {
    private llmService;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<ModelItem | undefined | null | void>;
    constructor(llmService: LocalLLMService);
    refresh(): void;
    getTreeItem(element: ModelItem): vscode.TreeItem;
    getChildren(element?: ModelItem): Promise<ModelItem[]>;
}
export declare class ModelItem extends vscode.TreeItem {
    readonly label: string;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    readonly command?: vscode.Command | undefined;
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command | undefined);
}
//# sourceMappingURL=models-tree-provider.d.ts.map