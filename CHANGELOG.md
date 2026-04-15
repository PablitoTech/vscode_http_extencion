# Changelog

Todas las actualizaciones notables de **Spring HTTP Generator** serán documentadas en este archivo.

## [0.0.3] - 2026-04-14

### 🚀 Nuevas Funcionalidades
- **Generación por carpeta**: Nuevo comando para generar archivos `.http` desde todos los controladores Spring Boot dentro de una carpeta seleccionada (recursivamente).
- **Variables en archivos HTTP**: Los archivos generados ahora incluyen variables `@baseUrl` y `@token` al inicio, con URLs usando `{{baseUrl}}` en lugar de la URL hardcodeada.
- **Soporte para `@Parameter(example)`**: Se leen los valores de `example` en anotaciones `@Parameter` de los parámetros del método para generar query strings más realistas.

### 🐛 Correcciones
- **Parser de firmas de método**: Se corrigió un bug donde anotaciones con paréntesis anidados (ej. `@Parameter(description = "...", example = "...")`) rompían la detección de la firma del método.
- **Contexto de anotaciones por campo**: Se mejoró el análisis de contexto para evitar que anotaciones de campos anteriores contaminen la lectura del campo actual.

### 🔧 Mejoras
- **Query string con valores reales**: Los `@RequestParam` ahora usan el `exampleValue` o `defaultValue` cuando están disponibles, en lugar del placeholder genérico `value`.
- **Cabecera de autorización**: Se simplificó la lógica — el header `Authorization: Bearer {{token}}` se incluye cuando `includeAuthHeader` está activo, sin requerir que el endpoint tenga `requiresAuth`.

## [0.0.2] - 2026-01-19

### 🚀 Nuevas Funcionalidades
- **Soporte para Swagger/OpenAPI**: Ahora la extensión lee las anotaciones `@Schema(example = "...")` en los DTOs para generar valores reales en el JSON.
- **Detección de Descripciones**: Se extraen las descripciones de los campos desde `@Schema(description = "...")` para futura documentación.
- **Mejora en DTO Parser**: Análisis más robusto de campos multilínea y anotaciones complejas.

## [0.0.1-beta] - 2026-01-17

### ✨ Lanzamiento Inicial (Beta)
- **Motor de Parsado Robusto**: Nuevo sistema basado en Regex para detectar controladores y métodos Spring Boot con alta precisión.
- **Generación de JSON inteligente**: Soporte para DTOs planos con tipos Java comunes (String, Integer, LocalDateTime, UUID, etc.).
- **Detección de Seguridad**: Soporte automático para `@PreAuthorize`, `@Secured` y `@SecurityRequirement`.
- **Integración con VS Code**:
  - Menús contextuales en el explorador de archivos y el editor.
  - Comandos dedicados en la Paleta de Comandos (`Ctrl+Shift+P`).
- **Modo Diagnóstico**: Nueva herramienta de diagnóstico integrada para verificar permisos y estado de la extensión.
- **Marca Personalizada**: Lanzamiento oficial bajo el sello de **PablitoTech**.

---
**Made with ❤️ for PablitoTech**
