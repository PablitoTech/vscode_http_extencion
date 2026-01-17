import * as vscode from 'vscode';
import { Logger } from '../utils/logUtils';
import { FileSystemUtils } from '../utils/fsUtils';

/**
 * Scans workspace for Spring Boot controllers
 */
export class ControllerScanner {
    /**
     * Find all controller files in the workspace
     */
    static async findAllControllers(): Promise<vscode.Uri[]> {
        const endTimer = Logger.time('Scanning for controllers');

        try {
            const controllers = await FileSystemUtils.findControllerFiles();
            Logger.info(`Found ${controllers.length} controller(s) in workspace`);
            return controllers;
        } finally {
            endTimer();
        }
    }

    /**
     * Get the currently active controller file
     */
    static getActiveController(): vscode.Uri | null {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return null;
        }

        const document = editor.document;

        // Check if it's a Java file
        if (document.languageId !== 'java') {
            return null;
        }

        // Check if it contains controller annotations
        const content = document.getText();
        if (!content.includes('@RestController') && !content.includes('@Controller')) {
            return null;
        }

        return document.uri;
    }

    /**
     * Get method at current cursor position
     */
    static getMethodAtCursor(): { content: string; range: vscode.Range } | null {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return null;
        }

        const document = editor.document;
        const position = editor.selection.active;

        // Get full document text
        const fullText = document.getText();
        const offset = document.offsetAt(position);

        // Find the method containing the cursor
        // Look backwards for method annotation
        let searchStart = offset;
        while (searchStart > 0) {
            const char = fullText[searchStart];
            if (char === '@') {
                // Found an annotation, check if it's a mapping annotation
                const remaining = fullText.substring(searchStart);
                if (this.isMappingAnnotation(remaining)) {
                    // Find the end of this method (next method or class end)
                    const methodEnd = this.findMethodEnd(fullText, searchStart);
                    const methodContent = fullText.substring(searchStart, methodEnd);

                    const startPos = document.positionAt(searchStart);
                    const endPos = document.positionAt(methodEnd);

                    return {
                        content: methodContent,
                        range: new vscode.Range(startPos, endPos)
                    };
                }
            }
            searchStart--;
        }

        return null;
    }

    /**
     * Check if text starts with a mapping annotation
     */
    private static isMappingAnnotation(text: string): boolean {
        return text.startsWith('@GetMapping') ||
            text.startsWith('@PostMapping') ||
            text.startsWith('@PutMapping') ||
            text.startsWith('@DeleteMapping') ||
            text.startsWith('@PatchMapping');
    }

    /**
     * Find the end of a method
     */
    private static findMethodEnd(text: string, start: number): number {
        let braceCount = 0;
        let inMethod = false;

        for (let i = start; i < text.length; i++) {
            const char = text[i];

            if (char === '{') {
                braceCount++;
                inMethod = true;
            } else if (char === '}') {
                braceCount--;
                if (inMethod && braceCount === 0) {
                    return i + 1;
                }
            }
        }

        return text.length;
    }
}
