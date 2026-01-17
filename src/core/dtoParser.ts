import { Logger } from '../utils/logUtils';
import { DtoInfo, DtoField } from './types';
import { TypeMapper } from '../utils/typeMapper';

/**
 * Parses Java DTO classes to extract field information
 */
export class DtoParser {
    /**
     * Parse a DTO class and extract field information
     */
    static parseDtoClass(content: string, className: string): DtoInfo | null {
        const endTimer = Logger.time(`Parsing DTO: ${className}`);

        try {
            // Using pure regex for robustness against different Java versions and Lombok
            const fields = this.extractFields(content);

            Logger.debug(`Parsed DTO ${className} with ${fields.length} fields`);

            return {
                className,
                fields
            };
        } catch (error) {
            Logger.error(`Failed to parse DTO: ${className}`, error);
            return null;
        } finally {
            endTimer();
        }
    }

    /**
     * Extract fields from DTO content using regex (simpler approach for MVP)
     */
    private static extractFields(content: string): DtoField[] {
        const fields: DtoField[] = [];

        // Match field declarations: private Type fieldName;
        const fieldPattern = /(?:private|public|protected)\s+([A-Za-z0-9<>,\s]+)\s+([a-zA-Z0-9_]+)\s*;/g;

        let match;
        while ((match = fieldPattern.exec(content)) !== null) {
            const type = match[1].trim();
            const name = match[2].trim();

            // Skip static fields
            if (content.substring(Math.max(0, match.index - 50), match.index).includes('static')) {
                continue;
            }

            // Check if field is required (has @NotNull, @NotEmpty, @NotBlank)
            const fieldContext = content.substring(Math.max(0, match.index - 200), match.index);
            const required = this.isFieldRequired(fieldContext);

            fields.push({
                name,
                type,
                required
            });
        }

        return fields;
    }

    /**
     * Check if a field is required based on validation annotations
     */
    private static isFieldRequired(fieldContext: string): boolean {
        return fieldContext.includes('@NotNull') ||
            fieldContext.includes('@NotEmpty') ||
            fieldContext.includes('@NotBlank');
    }

    /**
     * Generate example JSON from DTO fields
     */
    static generateExampleJson(dtoInfo: DtoInfo, indent: number = 2): string {
        const obj: Record<string, any> = {};

        for (const field of dtoInfo.fields) {
            obj[field.name] = TypeMapper.getExampleValue(field.type);
        }

        return JSON.stringify(obj, null, indent);
    }

    /**
     * Generate example JSON from DTO class content directly
     */
    static generateJsonFromContent(content: string, className: string): string {
        const dtoInfo = this.parseDtoClass(content, className);

        if (!dtoInfo) {
            Logger.warn(`Could not parse DTO ${className}, returning empty object`);
            return '{}';
        }

        return this.generateExampleJson(dtoInfo);
    }
}
