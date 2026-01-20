# Changelog

Todas las actualizaciones notables de **Spring HTTP Generator** serán documentadas en este archivo.

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
