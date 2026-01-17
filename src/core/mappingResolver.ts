import { Logger } from '../utils/logUtils';
import { ControllerInfo, EndpointMethod } from './types';

/**
 * Resolves complete endpoint paths by combining base path and method path
 */
export class MappingResolver {
    /**
     * Resolve full URL for an endpoint
     */
    static resolveUrl(baseUrl: string, basePath: string, methodPath: string): string {
        // Ensure baseUrl doesn't end with /
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');

        // Combine paths
        const fullPath = this.combinePaths(basePath, methodPath);

        return `${cleanBaseUrl}${fullPath}`;
    }

    /**
     * Combine base path and method path
     */
    static combinePaths(basePath: string, methodPath: string): string {
        // Normalize paths
        const cleanBasePath = basePath ? this.normalizePath(basePath) : '';
        const cleanMethodPath = methodPath ? this.normalizePath(methodPath) : '';

        // Combine
        if (!cleanBasePath && !cleanMethodPath) {
            return '/';
        }

        if (!cleanBasePath) {
            return cleanMethodPath;
        }

        if (!cleanMethodPath) {
            return cleanBasePath;
        }

        // Both exist, combine them
        return cleanBasePath + cleanMethodPath;
    }

    /**
     * Normalize a path segment
     */
    private static normalizePath(path: string): string {
        // Ensure starts with /
        let normalized = path.startsWith('/') ? path : '/' + path;

        // Remove trailing /
        normalized = normalized.replace(/\/$/, '');

        return normalized || '/';
    }

    /**
     * Replace path variables with placeholders
     */
    static formatPathVariables(path: string): string {
        // Replace {id} with {{id}} for .http file format
        return path.replace(/\{([^}]+)\}/g, '{{$1}}');
    }

    /**
     * Build query string from request parameters
     */
    static buildQueryString(params: { name: string; required: boolean }[]): string {
        if (params.length === 0) {
            return '';
        }

        const queryParams = params.map(p => `${p.name}=${p.required ? 'value' : ''}`);
        return '?' + queryParams.join('&');
    }

    /**
     * Get complete endpoint URL with all components
     */
    static getCompleteEndpoint(
        baseUrl: string,
        controller: ControllerInfo,
        method: EndpointMethod
    ): string {
        const url = this.resolveUrl(baseUrl, controller.basePath, method.path);
        const formattedUrl = this.formatPathVariables(url);

        // Add query parameters if any
        const requestParams = method.parameters.filter(p => p.annotation === 'RequestParam');
        if (requestParams.length > 0) {
            const queryString = this.buildQueryString(requestParams);
            return formattedUrl + queryString;
        }

        return formattedUrl;
    }
}
