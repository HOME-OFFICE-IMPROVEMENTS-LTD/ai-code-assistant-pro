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
exports.ModelItem = exports.ModelsTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
class ModelsTreeDataProvider {
    constructor(llmService) {
        this.llmService = llmService;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // Root level items
            const models = this.llmService.getAvailableModels();
            const items = [];
            if (models.length > 0) {
                items.push(new ModelItem(`✅ Connected to Ollama`, vscode.TreeItemCollapsibleState.None, {
                    command: 'aiCodePro.showModelStats',
                    title: 'Show Model Stats',
                    arguments: []
                }));
                models.forEach(model => {
                    items.push(new ModelItem(`🧠 ${model.name}`, vscode.TreeItemCollapsibleState.None, {
                        command: 'aiCodePro.showModelStats',
                        title: 'Show Model Stats',
                        arguments: [model.id]
                    }));
                });
            }
            else {
                items.push(new ModelItem(`❌ Not Connected`, vscode.TreeItemCollapsibleState.None, {
                    command: 'aiCodePro.connectModels',
                    title: 'Connect to Models',
                    arguments: []
                }));
            }
            items.push(new ModelItem(`🔗 Connect to Local LLMs`, vscode.TreeItemCollapsibleState.None, {
                command: 'aiCodePro.connectModels',
                title: 'Connect to Models',
                arguments: []
            }));
            items.push(new ModelItem(`⚙️ Settings`, vscode.TreeItemCollapsibleState.None, {
                command: 'aiCodePro.modelSettings',
                title: 'Open Settings',
                arguments: []
            }));
            return items;
        }
        return [];
    }
}
exports.ModelsTreeDataProvider = ModelsTreeDataProvider;
class ModelItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.tooltip = this.label;
        this.contextValue = 'modelItem';
    }
}
exports.ModelItem = ModelItem;
//# sourceMappingURL=models-tree-provider.js.map