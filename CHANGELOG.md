# Change Log

All notable changes to the "Spring HTTP Generator" extension will be documented in this file.

## [0.1.0] - 2025-12-30

### Added
- Initial release of Spring HTTP Generator
- Automatic detection of Spring Boot controllers in workspace
- Support for all HTTP mapping annotations (@GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping)
- Base path resolution from @RequestMapping
- Security annotation detection (@SecurityRequirement, @PreAuthorize, @RolesAllowed, @Secured)
- Automatic Authorization header generation for secured endpoints
- DTO parsing and JSON body generation
- Support for @RequestBody, @PathVariable, and @RequestParam
- Type mapping for common Java types (primitives, dates, collections, etc.)
- Three generation modes:
  - Generate from all controllers (Command Palette)
  - Generate from specific controller (Context Menu)
  - Generate from single method (Context Menu)
- Configurable base URL and output directory
- Progress notifications during generation
- Comprehensive logging to output channel

### Supported
- Java Spring Boot REST controllers
- Simple DTOs (flat structure)
- GET, POST, PUT, DELETE, PATCH methods
- Path variables with placeholder formatting
- Query parameters
- Validation annotations (@NotNull, @NotEmpty, @NotBlank)

### Known Limitations
- Nested DTOs are simplified to empty objects
- Complex generic types may not be fully resolved
- Java only (no Kotlin support yet)
- No multipart/form-data support

## [Unreleased]

### Planned for 0.2.0
- Nested DTO support
- Array and List field handling
- Improved generic type resolution
- Multipart file upload support
- Kotlin Spring Boot support
- Custom request templates
- OpenAPI/Swagger integration
