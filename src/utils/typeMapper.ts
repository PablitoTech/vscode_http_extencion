/**
 * Maps Java types to example JSON values
 */
export class TypeMapper {
    private static readonly TYPE_MAPPINGS: Record<string, any> = {
        // Primitive types
        'int': 0,
        'Integer': 0,
        'long': 0,
        'Long': 0,
        'double': 0.0,
        'Double': 0.0,
        'float': 0.0,
        'Float': 0.0,
        'boolean': false,
        'Boolean': false,
        'byte': 0,
        'Byte': 0,
        'short': 0,
        'Short': 0,
        'char': '',
        'Character': '',

        // String
        'String': '',

        // Date/Time types
        'LocalDate': '2025-01-01',
        'LocalDateTime': '2025-01-01T00:00:00',
        'LocalTime': '00:00:00',
        'Date': '2025-01-01T00:00:00',
        'Instant': '2025-01-01T00:00:00Z',
        'ZonedDateTime': '2025-01-01T00:00:00Z',
        'OffsetDateTime': '2025-01-01T00:00:00+00:00',

        // BigDecimal
        'BigDecimal': 0.0,
        'BigInteger': 0,

        // UUID
        'UUID': '00000000-0000-0000-0000-000000000000',
    };

    /**
     * Get example value for a Java type
     */
    static getExampleValue(javaType: string): any {
        // Remove generic type parameters
        const baseType = this.extractBaseType(javaType);

        // Check if it's a List/Set/Collection
        if (this.isCollectionType(baseType)) {
            const elementType = this.extractGenericType(javaType);
            return [this.getExampleValue(elementType || 'String')];
        }

        // Check if it's a Map
        if (this.isMapType(baseType)) {
            return {};
        }

        // Return mapped value or empty object for custom types
        return this.TYPE_MAPPINGS[baseType] ?? {};
    }

    /**
     * Extract base type from generic type declaration
     * Example: "List<String>" -> "List"
     */
    private static extractBaseType(type: string): string {
        const match = type.match(/^([^<]+)/);
        return match ? match[1].trim() : type;
    }

    /**
     * Extract generic type parameter
     * Example: "List<String>" -> "String"
     */
    private static extractGenericType(type: string): string | null {
        const match = type.match(/<([^>]+)>/);
        return match ? match[1].trim() : null;
    }

    /**
     * Check if type is a collection
     */
    private static isCollectionType(type: string): boolean {
        return ['List', 'Set', 'Collection', 'ArrayList', 'HashSet', 'LinkedList'].includes(type);
    }

    /**
     * Check if type is a map
     */
    private static isMapType(type: string): boolean {
        return ['Map', 'HashMap', 'LinkedHashMap', 'TreeMap'].includes(type);
    }

    /**
     * Determine if a type is primitive or standard library
     */
    static isStandardType(type: string): boolean {
        const baseType = this.extractBaseType(type);
        return baseType in this.TYPE_MAPPINGS ||
            this.isCollectionType(baseType) ||
            this.isMapType(baseType);
    }
}
