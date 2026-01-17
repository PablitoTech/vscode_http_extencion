import { TypeMapper } from '../../utils/typeMapper';

describe('TypeMapper', () => {
    describe('getExampleValue', () => {
        test('should map primitive types correctly', () => {
            expect(TypeMapper.getExampleValue('int')).toBe(0);
            expect(TypeMapper.getExampleValue('Integer')).toBe(0);
            expect(TypeMapper.getExampleValue('long')).toBe(0);
            expect(TypeMapper.getExampleValue('Long')).toBe(0);
            expect(TypeMapper.getExampleValue('double')).toBe(0.0);
            expect(TypeMapper.getExampleValue('Double')).toBe(0.0);
            expect(TypeMapper.getExampleValue('boolean')).toBe(false);
            expect(TypeMapper.getExampleValue('Boolean')).toBe(false);
        });

        test('should map String type', () => {
            expect(TypeMapper.getExampleValue('String')).toBe('');
        });

        test('should map date/time types correctly', () => {
            expect(TypeMapper.getExampleValue('LocalDate')).toBe('2025-01-01');
            expect(TypeMapper.getExampleValue('LocalDateTime')).toBe('2025-01-01T00:00:00');
            expect(TypeMapper.getExampleValue('LocalTime')).toBe('00:00:00');
        });

        test('should map BigDecimal correctly', () => {
            expect(TypeMapper.getExampleValue('BigDecimal')).toBe(0.0);
            expect(TypeMapper.getExampleValue('BigInteger')).toBe(0);
        });

        test('should map UUID correctly', () => {
            expect(TypeMapper.getExampleValue('UUID')).toBe('00000000-0000-0000-0000-000000000000');
        });

        test('should map List types to arrays', () => {
            const result = TypeMapper.getExampleValue('List<String>');
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(['']);
        });

        test('should map List of integers', () => {
            const result = TypeMapper.getExampleValue('List<Integer>');
            expect(result).toEqual([0]);
        });

        test('should map Map types to empty objects', () => {
            const result = TypeMapper.getExampleValue('Map<String, String>');
            expect(result).toEqual({});
        });

        test('should map unknown types to empty objects', () => {
            const result = TypeMapper.getExampleValue('CustomDTO');
            expect(result).toEqual({});
        });
    });

    describe('isStandardType', () => {
        test('should identify standard types', () => {
            expect(TypeMapper.isStandardType('String')).toBe(true);
            expect(TypeMapper.isStandardType('Integer')).toBe(true);
            expect(TypeMapper.isStandardType('LocalDate')).toBe(true);
            expect(TypeMapper.isStandardType('List<String>')).toBe(true);
            expect(TypeMapper.isStandardType('Map<String, Integer>')).toBe(true);
        });

        test('should identify custom types', () => {
            expect(TypeMapper.isStandardType('CustomDTO')).toBe(false);
            expect(TypeMapper.isStandardType('UserEntity')).toBe(false);
        });
    });
});
