import { Logger } from '../utils/logUtils';
import { ControllerInfo, EndpointMethod, MethodParameter } from './types';

/**
 * Parses Java controller files using robust regex
 */
export class ControllerParser {
    /**
     * Parse controller content and return structured info
     */
    static parseController(content: string, filePath: string): ControllerInfo | null {
        const endTimer = Logger.time(`Parsing controller: ${filePath}`);

        try {
            // Remove block comments for easier parsing
            const cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, ' ');

            const className = this.extractClassName(cleanContent);
            const basePath = this.extractBasePath(cleanContent);
            const requiresAuth = this.detectClassLevelAuth(cleanContent);
            const methods = this.extractMethods(cleanContent, requiresAuth);

            Logger.info(`Parsed controller ${className} from ${filePath}`);
            Logger.debug(`Found ${methods.length} methods and base path: ${basePath}`);

            return {
                className,
                basePath,
                requiresAuth,
                methods,
                filePath
            };
        } catch (error) {
            Logger.error(`Failed to parse controller: ${filePath}`, error);
            return null;
        } finally {
            endTimer();
        }
    }

    /**
     * Extract class name from controller content
     */
    private static extractClassName(content: string): string {
        const match = content.match(/(?:public|protected|private)?\s*(?:abstract|final|strictfp)*\s*class\s+([A-Za-z0-9_]+)/);
        return match ? match[1] : 'UnknownController';
    }

    /**
     * Extract root path from @RequestMapping at class level
     */
    private static extractBasePath(content: string): string {
        const classMatch = content.match(/class\s+[A-Za-z0-9_]+/);
        if (!classMatch) return '';

        const beforeClass = content.substring(0, classMatch.index);
        const mappingMatch = beforeClass.match(/@RequestMapping\s*\(\s*(?:(?:value|path)\s*=\s*)?["']([^"']+)["']/);

        return mappingMatch ? mappingMatch[1] : '';
    }

    /**
     * Extract all endpoint methods from controller
     */
    private static extractMethods(content: string, classRequiresAuth: boolean): EndpointMethod[] {
        const methods: EndpointMethod[] = [];
        const mappingPatterns = [
            { pattern: /@GetMapping/g, httpMethod: 'GET' as const },
            { pattern: /@PostMapping/g, httpMethod: 'POST' as const },
            { pattern: /@PutMapping/g, httpMethod: 'PUT' as const },
            { pattern: /@DeleteMapping/g, httpMethod: 'DELETE' as const },
            { pattern: /@PatchMapping/g, httpMethod: 'PATCH' as const },
            { pattern: /@RequestMapping/g, httpMethod: 'AUTO' as const }
        ];

        for (const { pattern, httpMethod } of mappingPatterns) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(content)) !== null) {
                // Skip if this annotation is BEFORE the class definition (it's class-level)
                const classMatch = content.match(/class\s+[A-Za-z0-9_]+/);
                if (classMatch && match.index < (classMatch.index ?? 0)) {
                    continue;
                }

                const methodInfo = this.extractMethodInfo(content, match.index, httpMethod, classRequiresAuth);
                if (methodInfo) {
                    methods.push(methodInfo);
                }
            }
        }

        return methods.sort((a, b) => a.lineNumber - b.lineNumber);
    }

    /**
     * Extract detailed information for a single method
     */
    private static extractMethodInfo(
        content: string,
        annotationIndex: number,
        hintMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'AUTO',
        classRequiresAuth: boolean
    ): EndpointMethod | null {
        const lineNumber = content.substring(0, annotationIndex).split('\n').length;
        const { path, method } = this.extractMappingInfo(content, annotationIndex, hintMethod);

        const afterAnnotation = content.substring(annotationIndex);
        const methodMatch = afterAnnotation.match(/(?:public|protected|private)?\s+(?:static\s+|final\s+|synchronized\s+|abstract\s+|native\s+)*([A-Za-z0-9<>?,\.[\]\s]+?)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)(?:\s*throws\s+[^{]+)?/);

        if (!methodMatch) return null;

        const methodName = methodMatch[2].trim();
        const paramsString = methodMatch[3];
        Logger.debug(`Extracted method ${methodName} with params: ${paramsString}`);
        const parameters = this.parseParameters(paramsString);

        // Simple security check
        const methodContext = content.substring(Math.max(0, annotationIndex - 500), annotationIndex);
        const requiresAuth = classRequiresAuth || methodContext.includes('@Secured') || methodContext.includes('@PreAuthorize');

        return {
            name: methodName,
            httpMethod: method as any,
            path,
            parameters,
            requiresAuth,
            lineNumber
        };
    }

    /**
     * Extract path and method from mapping annotation
     */
    private static extractMappingInfo(
        content: string,
        index: number,
        hint: string
    ): { path: string, method: string } {
        const afterAnnotation = content.substring(index);
        const annotationMatch = afterAnnotation.match(/@[A-Za-z]+Mapping\s*(\(([^)]*)\))?/);

        let path = '';
        let method = hint === 'AUTO' ? 'GET' : hint;

        if (annotationMatch && annotationMatch[2]) {
            const params = annotationMatch[2];
            const pathMatch = params.match(/(?:value|path)\s*=\s*["']([^"']+)["']/) || params.match(/["']([^"']+)["']/);
            if (pathMatch) path = pathMatch[1];

            if (hint === 'AUTO') {
                const methodMatch = params.match(/method\s*=\s*RequestMethod\.(GET|POST|PUT|DELETE|PATCH)/);
                if (methodMatch) method = methodMatch[1];
            }
        }

        return { path, method };
    }

    /**
     * Parse method parameters string
     */
    private static parseParameters(paramsString: string): MethodParameter[] {
        if (!paramsString || !paramsString.trim()) return [];

        const paramList = this.splitParameters(paramsString);
        return paramList.map(p => this.parseParameter(p)).filter((p): p is MethodParameter => p !== null);
    }

    private static splitParameters(paramsString: string): string[] {
        const result: string[] = [];
        let current = '';
        let depth = 0;

        for (let i = 0; i < paramsString.length; i++) {
            const char = paramsString[i];
            if (char === '<') depth++;
            else if (char === '>') depth--;

            if (char === ',' && depth === 0) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        if (current.trim()) result.push(current.trim());
        return result;
    }

    private static parseParameter(param: string): MethodParameter | null {
        let annotation: MethodParameter['annotation'] = null;
        if (param.includes('@RequestBody')) annotation = 'RequestBody';
        else if (param.includes('@PathVariable')) annotation = 'PathVariable';
        else if (param.includes('@RequestParam')) annotation = 'RequestParam';
        else if (param.includes('@RequestHeader')) annotation = 'RequestHeader';

        const cleanParam = param.replace(/@[A-Za-z]+\s*(\([^)]*\))?/g, '').trim();
        const parts = cleanParam.split(/\s+/);

        if (parts.length < 2) return null;

        const name = parts[parts.length - 1];
        const type = parts[parts.length - 2];

        return {
            name,
            type,
            annotation,
            required: param.includes('required = true') || annotation === 'RequestBody'
        };
    }

    private static detectClassLevelAuth(content: string): boolean {
        const classMatch = content.match(/class\s+[A-Za-z0-9_]+/);
        if (!classMatch) return false;
        const beforeClass = content.substring(0, classMatch.index);
        return beforeClass.includes('@Secured') || beforeClass.includes('@PreAuthorize') || beforeClass.includes('@RolesAllowed');
    }
}
