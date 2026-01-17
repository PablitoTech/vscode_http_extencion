import * as vscode from 'vscode';
import * as path from 'path';
import { Logger } from './utils/logUtils';
import { FileSystemUtils } from './utils/fsUtils';
import { ControllerScanner } from './core/controllerScanner';
import { ControllerParser } from './core/controllerParser';
import { HttpBuilder } from './core/httpBuilder';
import { HttpGenerationConfig } from './core/types';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
    Logger.initialize(context);
    Logger.info('Spring HTTP Generator extension activated');
    vscode.window.showInformationMessage('Spring HTTP Generator is ready! Use right-click on Java files.');

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'spring-http-generator.runDiagnostics',
            runDiagnosticsCommand
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'spring-http-generator.generateHttpFile',
            generateHttpFileCommand
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'spring-http-generator.generateHttpFromController',
            generateHttpFromControllerCommand
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'spring-http-generator.generateHttpFromMethod',
            generateHttpFromMethodCommand
        )
    );

    Logger.info('All commands registered successfully');
}

/**
 * Extension deactivation
 */
export function deactivate() {
    Logger.info('Spring HTTP Generator extension deactivated');
}

/**
 * Command: Generate HTTP file from all controllers in workspace
 */
async function generateHttpFileCommand() {
    try {
        Logger.info('Executing: Generate HTTP File');

        const controllers = await ControllerScanner.findAllControllers();

        if (controllers.length === 0) {
            vscode.window.showWarningMessage('No Spring Boot controllers found in workspace');
            return;
        }

        // Let user select which controller
        const items = controllers.map(uri => ({
            label: path.basename(uri.fsPath),
            description: FileSystemUtils.getRelativePath(uri),
            uri
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a controller to generate HTTP requests'
        });

        if (!selected) {
            return;
        }

        await generateHttpFromUri(selected.uri);
    } catch (error: any) {
        const message = Logger.formatError(error);
        Logger.error(`Failed to generate HTTP file: ${message}`, error);
        vscode.window.showErrorMessage(`Failed to generate HTTP file: ${message}. Check 'Spring HTTP Generator' output for details.`);
    }
}

/**
 * Command: Generate HTTP file from current controller
 */
async function generateHttpFromControllerCommand(uri?: vscode.Uri) {
    try {
        Logger.info('Executing: Generate HTTP from Controller');

        // Get URI from parameter or active editor
        const targetUri = uri || ControllerScanner.getActiveController();

        if (!targetUri) {
            vscode.window.showWarningMessage('No controller file selected or active');
            return;
        }

        await generateHttpFromUri(targetUri);
    } catch (error: any) {
        const message = Logger.formatError(error);
        Logger.error(`Failed to generate HTTP from controller: ${message}`, error);
        vscode.window.showErrorMessage(`Failed to generate HTTP file: ${message}. Check 'Spring HTTP Generator' output for details.`);
    }
}

/**
 * Command: Generate HTTP request from selected method
 */
async function generateHttpFromMethodCommand() {
    try {
        Logger.info('Executing: Generate HTTP from Method');

        const methodInfo = ControllerScanner.getMethodAtCursor();

        if (!methodInfo) {
            vscode.window.showWarningMessage('No method found at cursor position');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // Parse the full controller to get context
        const fullContent = editor.document.getText();
        const controllerInfo = ControllerParser.parseController(
            fullContent,
            editor.document.uri.fsPath
        );

        if (!controllerInfo || controllerInfo.methods.length === 0) {
            vscode.window.showWarningMessage('Could not parse controller');
            return;
        }

        // Find the method that matches the cursor position
        const cursorLine = editor.selection.active.line + 1;
        const method = controllerInfo.methods.find(m =>
            Math.abs(m.lineNumber - cursorLine) < 20
        );

        if (!method) {
            vscode.window.showWarningMessage('Could not identify method at cursor');
            return;
        }

        // Generate HTTP for this single method
        const config = getConfiguration();
        const httpContent = await HttpBuilder.generateSingleMethodHttp(
            controllerInfo,
            method,
            config
        );

        // Show in new document
        const doc = await vscode.workspace.openTextDocument({
            content: httpContent,
            language: 'http'
        });

        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage(
            `Generated HTTP request for ${method.name}`
        );
    } catch (error: any) {
        const message = Logger.formatError(error);
        Logger.error(`Failed to generate HTTP from method: ${message}`, error);
        vscode.window.showErrorMessage(`Failed to generate HTTP request: ${message}. Check 'Spring HTTP Generator' output for details.`);
    }
}

/**
 * Command: Run Diagnostics
 */
async function runDiagnosticsCommand() {
    try {
        const diagnosticInfo = [];
        diagnosticInfo.push('--- Spring HTTP Generator Diagnostics ---');
        diagnosticInfo.push(`Time: ${new Date().toISOString()}`);
        diagnosticInfo.push(`VS Code Version: ${vscode.version}`);

        const workspaceFolders = vscode.workspace.workspaceFolders;
        diagnosticInfo.push(`Workspace Folders: ${workspaceFolders ? workspaceFolders.length : 0}`);
        if (workspaceFolders) {
            workspaceFolders.forEach((f, i) => diagnosticInfo.push(`  [${i}] ${f.uri.fsPath}`));
        }

        const editor = vscode.window.activeTextEditor;
        diagnosticInfo.push(`Active Editor: ${editor ? editor.document.uri.fsPath : 'None'}`);
        if (editor) {
            diagnosticInfo.push(`  Language: ${editor.document.languageId}`);
            const content = editor.document.getText();
            diagnosticInfo.push(`  Content Length: ${content.length}`);
            diagnosticInfo.push(`  Has @RestController: ${content.includes('@RestController')}`);
            diagnosticInfo.push(`  Has @Controller: ${content.includes('@Controller')}`);

            try {
                const controllerInfo = ControllerParser.parseController(content, editor.document.uri.fsPath);
                diagnosticInfo.push(`  Parsed Controller: ${controllerInfo ? 'Success' : 'Failed'}`);
                if (controllerInfo) {
                    diagnosticInfo.push(`  Methods Found: ${controllerInfo.methods.length}`);
                }
            } catch (err: any) {
                diagnosticInfo.push(`  Parsing Error: ${err.message}`);
            }
        }

        const outputDir = FileSystemUtils.getOutputDirectory(editor?.document.uri);
        diagnosticInfo.push(`Target Output Directory: ${outputDir ? outputDir.fsPath : 'Could not determine'}`);

        if (outputDir) {
            try {
                await vscode.workspace.fs.stat(outputDir);
                diagnosticInfo.push('  Output Directory exists: Yes');
            } catch {
                diagnosticInfo.push('  Output Directory exists: No (will be created)');
            }
        }

        const report = diagnosticInfo.join('\n');
        const doc = await vscode.workspace.openTextDocument({ content: report, language: 'text' });
        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage('Diagnostics report generated in a new tab.');
    } catch (error: any) {
        vscode.window.showErrorMessage(`Diagnostics failed: ${error.message}`);
    }
}

/**
 * Generate HTTP file from a controller URI
 */
async function generateHttpFromUri(uri: vscode.Uri) {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'Generating HTTP requests...',
            cancellable: false
        },
        async progress => {
            try {
                // Read controller file
                progress.report({ message: 'Reading controller...' });
                const content = await FileSystemUtils.readFile(uri);

                // Parse controller
                progress.report({ message: 'Parsing controller...' });
                const controllerInfo = ControllerParser.parseController(content, uri.fsPath);

                if (!controllerInfo) {
                    throw new Error('Failed to parse controller: Parser returned null');
                }

                if (controllerInfo.methods.length === 0) {
                    vscode.window.showWarningMessage('No REST endpoints found in controller');
                    return;
                }

                // Generate HTTP file
                Logger.info(`Starting generation for ${controllerInfo.methods.length} methods`);
                progress.report({ message: 'Generating HTTP file...' });
                const config = getConfiguration();
                const httpContent = await HttpBuilder.generateHttpFile(controllerInfo, config);
                Logger.info('HTTP content generated successfully');

                // Determine output path
                const outputDir = FileSystemUtils.getOutputDirectory(uri);
                Logger.info(`Output directory determined: ${outputDir?.fsPath}`);

                if (!outputDir) {
                    Logger.error(`Could not determine output directory. Context URI: ${uri?.fsPath}`);
                    throw new Error('Could not determine output directory. Please open a folder/workspace or ensure the file is saved.');
                }

                Logger.info(`Ensuring directory exists: ${outputDir.fsPath}`);
                await FileSystemUtils.ensureDirectory(outputDir);

                const fileName = `${controllerInfo.className}.http`;
                const outputPath = vscode.Uri.joinPath(outputDir, fileName);

                // Write file
                Logger.info(`Writing to: ${outputPath.fsPath}`);
                progress.report({ message: 'Writing file...' });
                await FileSystemUtils.writeFile(outputPath, httpContent);
                Logger.info('File written successfully');

                // Open the file
                Logger.info('Opening generated file');
                const doc = await vscode.workspace.openTextDocument(outputPath);
                await vscode.window.showTextDocument(doc);

                vscode.window.showInformationMessage(
                    `Generated ${controllerInfo.methods.length} HTTP request(s) in ${fileName}`
                );
            } catch (err: any) {
                const message = Logger.formatError(err);
                Logger.error(`Critical error in generation loop: ${message}`, err);
                throw new Error(message); // Re-throw with formatted message
            }
        }
    );
}

/**
 * Get extension configuration
 */
function getConfiguration(): HttpGenerationConfig {
    const config = vscode.workspace.getConfiguration('spring-http-generator');

    return {
        baseUrl: config.get<string>('baseUrl', 'http://localhost:8080'),
        includeAuthHeader: config.get<boolean>('includeAuthHeader', true),
        outputDirectory: config.get<string>('outputDirectory', 'http-requests')
    };
}
