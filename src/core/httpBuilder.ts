import * as vscode from 'vscode';
import { Logger } from '../utils/logUtils';
import { FileSystemUtils } from '../utils/fsUtils';
import { ControllerInfo, EndpointMethod, HttpGenerationConfig } from './types';
import { MappingResolver } from './mappingResolver';
import { DtoParser } from './dtoParser';

/**
 * Builds .http file content from controller information
 */
export class HttpBuilder {
    /**
     * Generate .http file content for an entire controller
     */
    static async generateHttpFile(
        controller: ControllerInfo,
        config: HttpGenerationConfig
    ): Promise<string> {
        const endTimer = Logger.time(`Generating HTTP file for ${controller.className}`);

        try {
            const sections: string[] = [];

            // Add header comment
            sections.push(`### ${controller.className}`);
            const controllerUri = vscode.Uri.file(controller.filePath);
            sections.push(`# Generated from: ${FileSystemUtils.getRelativePath(controllerUri)}`);
            sections.push('');

            // Generate request for each method
            for (const method of controller.methods) {
                const request = await this.generateRequest(controller, method, config);
                sections.push(request);
                sections.push(''); // Blank line between requests
                sections.push('###'); // Request separator
                sections.push('');
            }

            return sections.join('\n');
        } finally {
            endTimer();
        }
    }

    /**
     * Generate a single HTTP request
     */
    static async generateRequest(
        controller: ControllerInfo,
        method: EndpointMethod,
        config: HttpGenerationConfig
    ): Promise<string> {
        const lines: string[] = [];

        // Add comment with method name
        lines.push(`# ${method.name}`);

        // Build request line
        const url = MappingResolver.getCompleteEndpoint(config.baseUrl, controller, method);
        lines.push(`${method.httpMethod} ${url}`);

        // Add authorization header if needed
        if (config.includeAuthHeader && method.requiresAuth) {
            lines.push('Authorization: Bearer {{token}}');
        }

        // Add Content-Type header for methods with body
        if (this.methodHasBody(method)) {
            lines.push('Content-Type: application/json');
        }

        // Add request body if needed
        const bodyParam = method.parameters.find(p => p.annotation === 'RequestBody');
        if (bodyParam) {
            lines.push(''); // Blank line before body
            const body = await this.generateRequestBody(bodyParam.type);
            lines.push(body);
        }

        return lines.join('\n');
    }

    /**
     * Check if HTTP method typically has a body
     */
    private static methodHasBody(method: EndpointMethod): boolean {
        return ['POST', 'PUT', 'PATCH'].includes(method.httpMethod) &&
            method.parameters.some(p => p.annotation === 'RequestBody');
    }

    /**
     * Generate request body JSON from DTO type
     */
    private static async generateRequestBody(dtoType: string): Promise<string> {
        try {
            // Find the DTO file
            Logger.info(`Searching for DTO: ${dtoType}`);
            const dtoFile = await FileSystemUtils.findDtoFile(dtoType);

            if (!dtoFile) {
                Logger.warn(`DTO file not found for type: ${dtoType}, using empty object`);
                return '{}';
            }

            Logger.info(`DTO file found: ${dtoFile.fsPath}. Parsing...`);
            // Read and parse DTO
            const content = await FileSystemUtils.readFile(dtoFile);
            const json = DtoParser.generateJsonFromContent(content, dtoType);
            Logger.info(`DTO ${dtoType} parsed successfully`);

            return json;
        } catch (error) {
            Logger.error(`Failed to generate request body for ${dtoType}`, error);
            return '{}';
        }
    }

    /**
     * Generate .http file for a single method
     */
    static async generateSingleMethodHttp(
        controller: ControllerInfo,
        method: EndpointMethod,
        config: HttpGenerationConfig
    ): Promise<string> {
        const sections: string[] = [];

        sections.push(`### ${controller.className}.${method.name}`);
        sections.push('');

        const request = await this.generateRequest(controller, method, config);
        sections.push(request);

        return sections.join('\n');
    }
}
