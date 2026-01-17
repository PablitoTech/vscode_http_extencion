import { MappingResolver } from '../../core/mappingResolver';

describe('MappingResolver', () => {
    describe('combinePaths', () => {
        test('should combine base path and method path', () => {
            expect(MappingResolver.combinePaths('/api/users', '/list')).toBe('/api/users/list');
        });

        test('should handle empty base path', () => {
            expect(MappingResolver.combinePaths('', '/users')).toBe('/users');
        });

        test('should handle empty method path', () => {
            expect(MappingResolver.combinePaths('/api/users', '')).toBe('/api/users');
        });

        test('should handle both empty paths', () => {
            expect(MappingResolver.combinePaths('', '')).toBe('/');
        });

        test('should normalize paths without leading slash', () => {
            expect(MappingResolver.combinePaths('api/users', 'list')).toBe('/api/users/list');
        });

        test('should remove trailing slashes', () => {
            expect(MappingResolver.combinePaths('/api/users/', '/list/')).toBe('/api/users/list');
        });
    });

    describe('resolveUrl', () => {
        test('should combine base URL with paths', () => {
            const url = MappingResolver.resolveUrl('http://localhost:8080', '/api/users', '/list');
            expect(url).toBe('http://localhost:8080/api/users/list');
        });

        test('should handle base URL with trailing slash', () => {
            const url = MappingResolver.resolveUrl('http://localhost:8080/', '/api/users', '/list');
            expect(url).toBe('http://localhost:8080/api/users/list');
        });
    });

    describe('formatPathVariables', () => {
        test('should format path variables for .http files', () => {
            const formatted = MappingResolver.formatPathVariables('/users/{id}');
            expect(formatted).toBe('/users/{{id}}');
        });

        test('should format multiple path variables', () => {
            const formatted = MappingResolver.formatPathVariables('/users/{userId}/posts/{postId}');
            expect(formatted).toBe('/users/{{userId}}/posts/{{postId}}');
        });

        test('should handle paths without variables', () => {
            const formatted = MappingResolver.formatPathVariables('/users/list');
            expect(formatted).toBe('/users/list');
        });
    });

    describe('buildQueryString', () => {
        test('should build query string from parameters', () => {
            const params = [
                { name: 'page', required: true },
                { name: 'size', required: true }
            ];
            const queryString = MappingResolver.buildQueryString(params);
            expect(queryString).toBe('?page=value&size=value');
        });

        test('should handle optional parameters', () => {
            const params = [
                { name: 'query', required: false }
            ];
            const queryString = MappingResolver.buildQueryString(params);
            expect(queryString).toBe('?query=');
        });

        test('should return empty string for no parameters', () => {
            const queryString = MappingResolver.buildQueryString([]);
            expect(queryString).toBe('');
        });
    });
});
