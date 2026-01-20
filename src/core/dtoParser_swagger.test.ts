// Mock Logger before importing DtoParser
jest.mock('../utils/logUtils', () => ({
    Logger: {
        debug: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        time: jest.fn(() => jest.fn())
    }
}));

import { DtoParser } from './dtoParser';

describe('DtoParser - Swagger Support', () => {
    describe('extractFields with Swagger', () => {
        test('should extract example value from @Schema', () => {
            const content = `
                public class DemoDTO {
                    @Schema(description = "User ID", example = "123")
                    private Long id;
                    
                    @Schema(example = "Juan")
                    private String name;
                    
                    @Schema(example = "true")
                    private Boolean isAdmin;
                }
            `;

            const result = DtoParser.parseDtoClass(content, 'DemoDTO');
            const fields = result?.fields || [];

            expect(fields).toHaveLength(3);
            expect(fields[0].exampleValue).toBe('123');
            expect(fields[0].description).toBe('User ID');

            expect(fields[1].exampleValue).toBe('Juan');
            expect(fields[2].exampleValue).toBe('true');
        });

        test('should extract description only', () => {
            const content = `
                public class DemoDTO {
                    @Schema(description = "Just a description")
                    private String notes;
                }
            `;

            const result = DtoParser.parseDtoClass(content, 'DemoDTO');
            const fields = result?.fields || [];

            expect(fields[0].description).toBe('Just a description');
            expect(fields[0].exampleValue).toBeUndefined();
        });

        test('should fallback to default when no Swagger is present', () => {
            const content = `
                public class MixedDTO {
                    @Schema(example = "Premium")
                    private String type;
                    
                    private String status;
                }
            `;

            const result = DtoParser.parseDtoClass(content, 'MixedDTO');
            const fields = result?.fields || [];

            expect(fields[0].name).toBe('type');
            expect(fields[0].exampleValue).toBe('Premium');

            expect(fields[1].name).toBe('status');
            expect(fields[1].exampleValue).toBeUndefined();
        });

        test('should match multiline @Schema annotations', () => {
            const content = `
                public class MultiLineDTO {
                    @Schema(
                        description = "Complex description here",
                        example = "ComplexValue"
                    )
                    private String complex;
                }
            `;

            const result = DtoParser.parseDtoClass(content, 'MultiLineDTO');
            const fields = result?.fields || [];

            expect(fields[0].name).toBe('complex');
            expect(fields[0].exampleValue).toBe('ComplexValue');
            expect(fields[0].description).toBe('Complex description here');
        });
    });

    describe('generateExampleJson with Swagger', () => {
        test('should use swagger example over default', () => {
            const dtoInfo = {
                className: 'UserDTO',
                fields: [
                    { name: 'id', type: 'Long', required: true, exampleValue: '100' },
                    { name: 'active', type: 'Boolean', required: true, exampleValue: 'true' },
                    { name: 'score', type: 'Double', required: false, exampleValue: '9.9' }
                ]
            };

            const json = DtoParser.generateExampleJson(dtoInfo);
            const parsed = JSON.parse(json);

            expect(parsed.id).toBe(100);
            expect(parsed.active).toBe(true);
            expect(parsed.score).toBe(9.9);
        });

        test('should handle mixed content (Swagger + Default)', () => {
            const dtoInfo = {
                className: 'MixedDTO',
                fields: [
                    { name: 'custom', type: 'String', required: true, exampleValue: 'CustomVal' },
                    { name: 'default', type: 'String', required: true }
                ]
            };

            const json = DtoParser.generateExampleJson(dtoInfo);
            const parsed = JSON.parse(json);

            expect(parsed.custom).toBe('CustomVal');
            expect(parsed.default).toBe('');
        });
    });
});
