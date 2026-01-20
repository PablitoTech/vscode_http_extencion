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
     * Extract fields from DTO content using regex
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
            if (content.substring(Math.max(0, match.index - 500), match.index).includes('static')) {
                continue;
            }

            // Get context (annotations above the field)
            // Look back up to 500 chars to catch multi-line annotations
            let fieldContext = content.substring(Math.max(0, match.index - 500), match.index);

            // Optimization: Only look at content after the last semicolon (end of previous field)
            // This prevents grabbing annotations from the previous field
            const lastSemicolon = fieldContext.lastIndexOf(';');
            if (lastSemicolon !== -1) {
                fieldContext = fieldContext.substring(lastSemicolon + 1);
            }

            const required = this.isFieldRequired(fieldContext);
            const exampleValue = this.extractSwaggerExample(fieldContext);
            const description = this.extractSwaggerDescription(fieldContext);

            fields.push({
                name,
                type,
                required,
                exampleValue,
                description
            });
        }

        return fields;
    }

    /**
     * Extract example value from @Schema annotation
     */
    private static extractSwaggerExample(context: string): string | undefined {
        // Look for @Schema(... example = "value" ...)
        const schemaMatch = /@Schema\s*\(([^)]*)\)/.exec(context);
        if (!schemaMatch) return undefined;

        const content = schemaMatch[1];

        // Try to match example = "value"
        const exampleMatch = /example\s*=\s*"([^"]*)"/.exec(content);
        if (exampleMatch) return exampleMatch[1];

        // Try to match example = number/boolean
        const examplePrimitiveMatch = /example\s*=\s*([0-9.]+|true|false)/.exec(content);
        if (examplePrimitiveMatch) return examplePrimitiveMatch[1];

        return undefined;
    }

    /**
     * Extract description from @Schema annotation
     */
    private static extractSwaggerDescription(context: string): string | undefined {
        const schemaMatch = /@Schema\s*\(([^)]*)\)/.exec(context);
        if (!schemaMatch) return undefined;

        const descriptionMatch = /description\s*=\s*"([^"]*)"/.exec(schemaMatch[1]);
        return descriptionMatch ? descriptionMatch[1] : undefined;
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
            // Use Swagger example if available
            if (field.exampleValue !== undefined) {
                obj[field.name] = this.parseExampleValue(field.exampleValue, field.type);
            } else {
                obj[field.name] = TypeMapper.getExampleValue(field.type);
            }
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

    /**
     * Cast string example to correct type if possible
     */
    private static parseExampleValue(value: string, type: string): any {
        const simpleType = type.split('<')[0].replace('java.lang.', '');

        switch (simpleType) {
            case 'Integer':
            case 'int':
            case 'Long':
            case 'long':
            case 'Short':
            case 'short':
            case 'Byte':
            case 'byte':
                return parseInt(value) || 0;
            case 'Double':
            case 'double':
            case 'Float':
            case 'float':
            case 'BigDecimal':
                return parseFloat(value) || 0.0;
            case 'Boolean':
            case 'boolean':
                return value === 'true';
            default:
                return value;
        }
    }
}
