// Mock for VS Code API
// This provides a minimal mock of the VS Code API for testing

export const window = {
    showInformationMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    createOutputChannel: jest.fn(() => ({
        appendLine: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        dispose: jest.fn()
    })),
    createWebviewPanel: jest.fn(() => ({
        webview: {
            html: '',
            onDidReceiveMessage: jest.fn(),
            postMessage: jest.fn()
        },
        dispose: jest.fn(),
        onDidDispose: jest.fn()
    }))
};

export const workspace = {
    getConfiguration: jest.fn(() => ({
        get: jest.fn(),
        update: jest.fn(),
        has: jest.fn(() => true)
    })),
    onDidChangeConfiguration: jest.fn(),
    workspaceFolders: []
};

export const commands = {
    registerCommand: jest.fn(),
    executeCommand: jest.fn()
};

export const Uri = {
    file: jest.fn((path: string) => ({ fsPath: path, path })),
    parse: jest.fn()
};

export const ViewColumn = {
    One: 1,
    Two: 2,
    Three: 3
};

export const WebviewPanel = jest.fn();

export const ExtensionContext = jest.fn();

export const StatusBarAlignment = {
    Left: 1,
    Right: 2
};

export const TreeDataProvider = jest.fn();

export const Event = jest.fn();

export const EventEmitter = jest.fn(() => ({
    event: jest.fn(),
    fire: jest.fn(),
    dispose: jest.fn()
}));

export default {
    window,
    workspace,
    commands,
    Uri,
    ViewColumn,
    WebviewPanel,
    ExtensionContext,
    StatusBarAlignment,
    TreeDataProvider,
    Event,
    EventEmitter
};