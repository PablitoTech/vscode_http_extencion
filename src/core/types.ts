/**
 * Represents a field in a DTO class
 */
export interface DtoField {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    exampleValue?: string;
}

/**
 * Represents a parsed DTO class
 */
export interface DtoInfo {
    className: string;
    fields: DtoField[];
}

/**
 * Represents a method parameter
 */
export interface MethodParameter {
    name: string;
    type: string;
    annotation: 'RequestBody' | 'PathVariable' | 'RequestParam' | 'RequestHeader' | null;
    required: boolean;
    defaultValue?: string;
}

/**
 * Represents an endpoint method
 */
export interface EndpointMethod {
    name: string;
    httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    parameters: MethodParameter[];
    requiresAuth: boolean;
    description?: string;
    lineNumber: number;
}

/**
 * Represents a Spring controller
 */
export interface ControllerInfo {
    className: string;
    basePath: string;
    requiresAuth: boolean;
    methods: EndpointMethod[];
    filePath: string;
}

/**
 * Configuration for HTTP generation
 */
export interface HttpGenerationConfig {
    baseUrl: string;
    includeAuthHeader: boolean;
    outputDirectory: string;
}
