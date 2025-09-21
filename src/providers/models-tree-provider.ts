import * as vscode from 'vscode';
import { LocalLLMService } from '../services/local-llm-service';

export class ModelsTreeDataProvider implements vscode.TreeDataProvider<ModelItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ModelItem | undefined | null | void> = new vscode.EventEmitter<ModelItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ModelItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private llmService: LocalLLMService) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ModelItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ModelItem): Promise<ModelItem[]> {
        if (!element) {
            // Root level items
            const models = this.llmService.getAvailableModels();
            const items: ModelItem[] = [];

            if (models.length > 0) {
                items.push(new ModelItem(
                    `✅ Connected to Ollama`,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'aiCodePro.showModelStats',
                        title: 'Show Model Stats',
                        arguments: []
                    }
                ));

                models.forEach(model => {
                    items.push(new ModelItem(
                        `🧠 ${model.name}`,
                        vscode.TreeItemCollapsibleState.None,
                        {
                            command: 'aiCodePro.showModelStats',
                            title: 'Show Model Stats',
                            arguments: [model.id]
                        }
                    ));
                });
            } else {
                items.push(new ModelItem(
                    `❌ Not Connected`,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'aiCodePro.connectModels',
                        title: 'Connect to Models',
                        arguments: []
                    }
                ));
            }

            items.push(new ModelItem(
                `🔗 Connect to Local LLMs`,
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'aiCodePro.connectModels',
                    title: 'Connect to Models',
                    arguments: []
                }
            ));

            items.push(new ModelItem(
                `⚙️ Settings`,
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'aiCodePro.modelSettings',
                    title: 'Open Settings',
                    arguments: []
                }
            ));

            return items;
        }

        return [];
    }
}

export class ModelItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = this.label;
        this.contextValue = 'modelItem';
    }
}