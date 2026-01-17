import { DtoParser } from '../../core/dtoParser';

describe('DtoParser', () => {
    describe('parseDtoClass', () => {
        test('should parse simple DTO fields', () => {
            const content = `
        package com.example.dto;
        
        public class UserDTO {
          private Long id;
          private String name;
          private Integer age;
        }
      `;

            const result = DtoParser.parseDtoClass(content, 'UserDTO');

            expect(result).not.toBeNull();
            expect(result?.className).toBe('UserDTO');
            expect(result?.fields).toHaveLength(3);
            expect(result?.fields[0]).toEqual({
                name: 'id',
                type: 'Long',
                required: false
            });
            expect(result?.fields[1]).toEqual({
                name: 'name',
                type: 'String',
                required: false
            });
        });

        test('should detect required fields with @NotNull', () => {
            const content = `
        package com.example.dto;
        
        import javax.validation.constraints.NotNull;
        
        public class UserDTO {
          @NotNull
          private Long id;
          
          private String name;
        }
      `;

            const result = DtoParser.parseDtoClass(content, 'UserDTO');

            expect(result?.fields[0].required).toBe(true);
            expect(result?.fields[1].required).toBe(false);
        });

        test('should detect required fields with @NotEmpty', () => {
            const content = `
        package com.example.dto;
        
        import javax.validation.constraints.NotEmpty;
        
        public class UserDTO {
          @NotEmpty
          private String name;
        }
      `;

            const result = DtoParser.parseDtoClass(content, 'UserDTO');

            expect(result?.fields[0].required).toBe(true);
        });

        test('should handle date/time types', () => {
            const content = `
        package com.example.dto;
        
        import java.time.LocalDate;
        import java.time.LocalDateTime;
        
        public class EventDTO {
          private LocalDate date;
          private LocalDateTime timestamp;
        }
      `;

            const result = DtoParser.parseDtoClass(content, 'EventDTO');

            expect(result?.fields).toHaveLength(2);
            expect(result?.fields[0].type).toBe('LocalDate');
            expect(result?.fields[1].type).toBe('LocalDateTime');
        });

        test('should handle generic types', () => {
            const content = `
        package com.example.dto;
        
        import java.util.List;
        
        public class ContainerDTO {
          private List<String> items;
        }
      `;

            const result = DtoParser.parseDtoClass(content, 'ContainerDTO');

            expect(result?.fields[0].type).toBe('List<String>');
        });
    });

    describe('generateExampleJson', () => {
        test('should generate JSON from DTO info', () => {
            const dtoInfo = {
                className: 'UserDTO',
                fields: [
                    { name: 'id', type: 'Long', required: true },
                    { name: 'name', type: 'String', required: true },
                    { name: 'age', type: 'Integer', required: false }
                ]
            };

            const json = DtoParser.generateExampleJson(dtoInfo);
            const parsed = JSON.parse(json);

            expect(parsed).toEqual({
                id: 0,
                name: '',
                age: 0
            });
        });

        test('should handle date fields in JSON', () => {
            const dtoInfo = {
                className: 'EventDTO',
                fields: [
                    { name: 'date', type: 'LocalDate', required: true },
                    { name: 'timestamp', type: 'LocalDateTime', required: false }
                ]
            };

            const json = DtoParser.generateExampleJson(dtoInfo);
            const parsed = JSON.parse(json);

            expect(parsed.date).toBe('2025-01-01');
            expect(parsed.timestamp).toBe('2025-01-01T00:00:00');
        });
    });
});
