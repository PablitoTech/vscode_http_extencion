import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logUtils';

/**
 * File system utilities for the extension
 */
export class FileSystemUtils {
    /**
     * Find files matching a glob pattern in the workspace
     */
    static async findFiles(pattern: string, exclude?: string): Promise<vscode.Uri[]> {
        const endTimer = Logger.time(`Finding files with pattern: ${pattern}`);
        try {
            const files = await vscode.workspace.findFiles(pattern, exclude);
            Logger.debug(`Found ${files.length} files matching pattern: ${pattern}`);
            return files;
        } finally {
            endTimer();
        }
    }

    /**
     * Find all Java controller files in the workspace
     */
    static async findControllerFiles(): Promise<vscode.Uri[]> {
        // Search for Java files that likely contain controllers
        const javaFiles = await this.findFiles('**/*.java', '**/node_modules/**');

        const controllerFiles: vscode.Uri[] = [];

        for (const file of javaFiles) {
            const content = await this.readFile(file);
            // Check if file contains controller annotations
            if (this.isControllerFile(content)) {
                controllerFiles.push(file);
            }
        }

        Logger.info(`Found ${controllerFiles.length} controller files`);
        return controllerFiles;
    }

    /**
     * Check if a file contains controller annotations
     */
    private static isControllerFile(content: string): boolean {
        return content.includes('@RestController') ||
            content.includes('@Controller');
    }

    /**
     * Read file contents
     */
    static async readFile(uri: vscode.Uri): Promise<string> {
        try {
            const bytes = await vscode.workspace.fs.readFile(uri);
            return Buffer.from(bytes).toString('utf8');
        } catch (error: any) {
            const message = error instanceof Error ? error.message : String(error);
            Logger.error(`Failed to read file: ${uri.fsPath}. ${message}`, error);
            throw new Error(`Failed to read file: ${path.basename(uri.fsPath)}. ${message}`);
        }
    }

    /**
     * Write content to a file
     */
    static async writeFile(uri: vscode.Uri, content: string): Promise<void> {
        try {
            Logger.debug(`Attempting to write file: ${uri.fsPath}`);
            const bytes = Buffer.from(content, 'utf8');
            await vscode.workspace.fs.writeFile(uri, bytes);
            Logger.info(`Successfully written file: ${uri.fsPath}`);
        } catch (error: any) {
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            Logger.error(`Failed to write file: ${uri.fsPath}. Error: ${message}`, error);
            throw new Error(`Write failed for ${path.basename(uri.fsPath)}: ${message}`);
        }
    }

    /**
     * Create directory if it doesn't exist
     */
    static async ensureDirectory(uri: vscode.Uri): Promise<void> {
        try {
            Logger.debug(`Ensuring directory exists: ${uri.fsPath}`);
            await vscode.workspace.fs.createDirectory(uri);
        } catch (error: any) {
            // Check if error is because it already exists
            // Some environments throw even if it exists
            const message = error instanceof Error ? error.message : String(error);
            if (message.toLowerCase().includes('exists') || message.toLowerCase().includes('entryexists')) {
                return;
            }
            Logger.error(`Failed to ensure directory: ${uri.fsPath}. ${message}`, error);
            throw new Error(`Could not create directory ${uri.fsPath}: ${message}`);
        }
    }

    /**
   * Get output directory for .http files
   */
    static getOutputDirectory(contextUri?: vscode.Uri): vscode.Uri | null {
        const config = vscode.workspace.getConfiguration('spring-http-generator');
        const outputDirName = config.get<string>('outputDirectory', 'http-requests');

        // Try to find workspace folder for the file
        let workspaceFolder: vscode.WorkspaceFolder | undefined;

        if (contextUri) {
            workspaceFolder = vscode.workspace.getWorkspaceFolder(contextUri);
        } else {
            workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        }

        if (workspaceFolder) {
            return vscode.Uri.joinPath(workspaceFolder.uri, outputDirName);
        }

        // Fallback: If no workspace, try to use the file's own directory (if provided)
        if (contextUri) {
            const parentDir = vscode.Uri.file(path.dirname(contextUri.fsPath));
            // Create 'http-requests' inside the file's directory
            return vscode.Uri.joinPath(parentDir, outputDirName);
        }

        return null;
    }

    /**
     * Find DTO file by class name
     */
    static async findDtoFile(className: string): Promise<vscode.Uri | null> {
        const fileName = `${className}.java`;
        const files = await this.findFiles(`**/${fileName}`, '**/node_modules/**');

        if (files.length === 0) {
            Logger.warn(`DTO file not found: ${className}`);
            return null;
        }

        if (files.length > 1) {
            Logger.warn(`Multiple files found for DTO: ${className}, using first one`);
        }

        return files[0];
    }

    /**
     * Get relative path from workspace root
     */
    static getRelativePath(uri: vscode.Uri): string {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (workspaceFolder) {
            return path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
        }
        return uri.fsPath;
    }
}
