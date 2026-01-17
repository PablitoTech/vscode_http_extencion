import * as vscode from 'vscode';

/**
 * Logging utility for the extension
 */
export class Logger {
    private static outputChannel: vscode.OutputChannel;

    static initialize(context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel('Spring HTTP Generator');
        context.subscriptions.push(this.outputChannel);
    }

    static debug(message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[DEBUG ${timestamp}] ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        console.debug(formattedMessage, ...args);
        if (args.length > 0) {
            this.outputChannel.appendLine(JSON.stringify(args, null, 2));
        }
    }

    static info(message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[INFO ${timestamp}] ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        console.info(formattedMessage, ...args);
        if (args.length > 0) {
            this.outputChannel.appendLine(JSON.stringify(args, null, 2));
        }
    }

    static warn(message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[WARN ${timestamp}] ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        console.warn(formattedMessage, ...args);
        if (args.length > 0) {
            this.outputChannel.appendLine(JSON.stringify(args, null, 2));
        }
    }

    static error(message: string, error?: Error | any) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[ERROR ${timestamp}] ${message}`;
        this.outputChannel.appendLine(formattedMessage);
        console.error(formattedMessage, error);
        if (error) {
            if (error instanceof Error) {
                this.outputChannel.appendLine(`  ${error.message}`);
                if (error.stack) {
                    this.outputChannel.appendLine(error.stack);
                }
            } else {
                this.outputChannel.appendLine(JSON.stringify(error, null, 2));
            }
        }
    }

    static show() {
        this.outputChannel.show();
    }

    static clear() {
        this.outputChannel.clear();
    }

    /**
     * Performance timing helper
     */
    static time(label: string): () => void {
        const start = Date.now();
        return () => {
            const duration = Date.now() - start;
            this.debug(`${label} took ${duration}ms`);
        };
    }

    /**
     * Format any error object into a readable string
     */
    static formatError(error: any): string {
        if (!error) return 'Unknown error';
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message;

        // Handle common VS Code / Node error objects that don't inherit from Error correctly
        const obj: any = {};
        const props = ['message', 'code', 'name', 'stack', 'reason'];
        for (const p of props) {
            if (error && typeof error === 'object' && p in error) {
                obj[p] = error[p];
            }
        }

        if (Object.keys(obj).length > 0) {
            if (obj.message && Object.keys(obj).length === 1) return obj.message;
            return JSON.stringify(obj);
        }

        try {
            return JSON.stringify(error);
        } catch {
            return String(error);
        }
    }
}
