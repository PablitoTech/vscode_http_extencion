// Mock VS Code API for testing
export const window = {
    showInformationMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    createOutputChannel: jest.fn(() => ({
        appendLine: jest.fn(),
        show: jest.fn(),
        clear: jest.fn(),
        dispose: jest.fn()
    })),
    showQuickPick: jest.fn(),
    withProgress: jest.fn(),
    activeTextEditor: undefined
};

export const workspace = {
    findFiles: jest.fn(),
    getConfiguration: jest.fn(() => ({
        get: jest.fn()
    })),
    workspaceFolders: [],
    fs: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        createDirectory: jest.fn()
    },
    openTextDocument: jest.fn(),
    getWorkspaceFolder: jest.fn()
};

export const commands = {
    registerCommand: jest.fn()
};

export const Uri = {
    file: (path: string) => ({ fsPath: path, path }),
    joinPath: (...args: any[]) => args[args.length - 1]
};

export const Range = jest.fn();
export const Position = jest.fn();
export const ProgressLocation = {
    Notification: 15
};

export default {
    window,
    workspace,
    commands,
    Uri,
    Range,
    Position,
    ProgressLocation
};
